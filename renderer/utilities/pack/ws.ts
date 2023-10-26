import EventEmitter from 'events';
import VenturePack from "./venturePack";
import apiConfig from '../config/apiConfig';
import { Opcode } from './ws/OpCodes';

export default class DiscoSocket {
    ws: WebSocket;
    seq: number = null;

    constructor(venturePack: VenturePack, token: string, userAgent: string) {
        if (!venturePack.searchPack('_dispatch')) venturePack.createPackItem('_dispatch', new EventEmitter());

        if (venturePack.searchPack('_ws')) this.ws = venturePack.searchPack('_ws')[3][0];
        else {
            this.ws = new WebSocket(apiConfig.gatewayUrl + '?v=' + apiConfig.version + '&encoding=json');
            venturePack.createPackItem('_ws', [this.ws, this.seq]);

            this.ws.onclose = (e) => console.log(`closed`, e);

            this.ws.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);

                if (data.s) this.seq = data.s;

                switch (data.op) {
                    case Opcode.HELLO:
                        if (venturePack.searchPack('_ws__HeartbeatInterval')) clearInterval(venturePack.searchPack('_ws__HeartbeatInterval')[3]);

                        venturePack.createPackItem('_ws__HeartbeatInterval', setInterval(() => {
                            this.send(Opcode.HEARTBEAT, this.seq);
                        }, data.d.heartbeat_interval ?? 41_250));

                        this.send(Opcode.IDENTIFY, {
                            token,
                            capabilities: 16381,
                            properties: {
                                os: 'Windows',
                                browser: 'Discord Client',
                                device: 'Discord Client',
                                system_locale: 'en-US',
                                os_version: '10',
                                release_channel: 'canary'
                            },
                            presence: { status: 'unknown', since: 0, activities: [], afk: false },
                            compress: false,
                            client_state: {
                                guild_versions: {},
                                highest_last_message_id: '0',
                                read_state_version: 0,
                                user_guild_settings_version: -1,
                                user_settings_version: -1,
                                private_channels_version: '0',
                                api_code_version: 0
                            }
                        });
                        break;
                    case Opcode.HEARTBEAT_ACK:
                        console.log('Heartbeat acknowledged.');
                        break;
                    case Opcode.DISPATCH:
                        if (data.t) venturePack.searchPack('_dispatch')[3].emit(data.t, data.d);
                        venturePack.searchPack('_dispatch')[3].emit('_', {
                            event: data.t,
                            payload: data.d
                        });

                        break;
                }
            }
        };
    }

    send(Opcode: Opcode, data: any) {
        if (this.ws.readyState !== WebSocket.OPEN) return;

        const payload = {
            op: Opcode,
            d: data
        }

        this.ws.send(JSON.stringify(payload));
    }
}
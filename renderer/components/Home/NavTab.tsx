/*
 * Venture, an open-source Discord client focused on speed and convenience.
 * Copyright (c) 2023 Zyrenth
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export default function NavTab({
    name,
    notificationCount,
    active,
    filled,
    // eslint-disable-next-line no-unused-vars
    onClick,
}: {
    name: string;
    notificationCount?: number;
    active?: boolean;
    filled?: boolean;
    onClick?: () => void;
}) {
    const extraFields = [];

    if (active) extraFields.push('NavTab__Active');
    if (filled) extraFields.push('NavTab__Filled');

    return (
        <div className={`NavTabs__NavTab ${extraFields.join(' ')}`}>
            <span className="NavTab__Name">{name}</span>
            {notificationCount ? (
                <span className="NavTab__NotificationCount">{notificationCount > 9 ? '9+' : notificationCount}</span>
            ) : null}
        </div>
    );
}


import { NavLink } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import './sidebar.css'

export function Sidebar() {
    const { user, logout } = useAuth()

    if (!user) return null

    return (
        <aside className="sidebar">
            <p className="sidebar__brand">Connect 4</p>

            <nav className="sidebar__nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                    }
                >
                    Play
                </NavLink>

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                    }
                >
                    History
                </NavLink>
            </nav>

            <div className="sidebar__footer">
                <p className="sidebar__name">{user.name}</p>
                <button type="button" onClick={() => void logout()}>
                    Logout
                </button>
            </div>
        </aside>
    )
}
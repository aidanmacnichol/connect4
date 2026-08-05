import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import { Modal } from '../../components/modal/Modal'
import { DisplayNameForm } from './DisplayNameForm'
import './ProfilePage.css'

export function ProfilePage() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const needsDisplayName = !user?.display_name

    if (!user) return null

    return (
        <div className="profile-page">
            <header className="profile-page__header">
                <h1 className="profile-page__title">Profile</h1>
                <p className="profile-page__subtitle">Your account details and public name.</p>
            </header>

            <section className="profile-page__card">
                {user.avatar_url ? (
                    <img
                        className="profile-page__avatar"
                        src={user.avatar_url}
                        alt=""
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="profile-page__avatar profile-page__avatar--placeholder" aria-hidden />
                )}

                <dl className="profile-page__dl">
                    <div>
                        <dt>Display name</dt>
                        <dd>{user.display_name ?? 'Not set'}</dd>
                    </div>
                    <div>
                        <dt>Name</dt>
                        <dd>{user.name}</dd>
                    </div>
                    <div>
                        <dt>Email</dt>
                        <dd>{user.email}</dd>
                    </div>
                </dl>

                {!needsDisplayName ? (
                    <div className="profile-page__edit">
                        <h2 className="profile-page__edit-title">Change display name</h2>
                        <DisplayNameForm
                            initialValue={user.display_name ?? ''}
                            submitLabel="Update"
                            onSaved={setUser}
                        />
                    </div>
                ) : null}
            </section>

            {needsDisplayName ? (
                <Modal title="Choose a display name" dismissible={false}>
                    <p className="profile-page__modal-copy">
                        Choose a username. You can change it later.
                    </p>
                    <DisplayNameForm
                        submitLabel="Continue"
                        onSaved={(next) => {
                            setUser(next)
                            void navigate('/', { replace: true })
                        }}
                    />
                </Modal>
            ) : null}
        </div>
    )
}

export default ProfilePage

export default function NavbarDashboard(props) {
  return (
    <>
      <div className="navbar bg-primary">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-white"></a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={props.userPicture} referrerPolicy="no-referrer" />
              </div>
            </label>
            <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-white text-black">
              <li><a>Ubah Profil</a></li>
              <li><a onClick={props.handleSignOut}>Keluar</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
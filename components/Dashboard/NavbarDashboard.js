/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

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
                <img src={props.userPicture} alt="Foto Profil" referrerPolicy="no-referrer" />
              </div>
            </label>
            <ul tabIndex="0" className="menu menu-compact dropdown-content px-8 mt-3 py-2 shadow rounded-box w-fit bg-white text-black">
              <div className="flex flex-col">
                <div className="mx-auto my-2">
                  <img className="rounded-full" src={props.userPicture} alt="Foto Profil" />
                </div>
                <div className='whitespace-nowrap text-center text-xl font-semibold'>
                  {props.userName}
                </div>
                <div className='whitespace-nowrap text-center text-xl'>
                  {props.userEmail}
                </div>
              </div>
              <div className="btn btn-primary my-4 w-20 mx-auto">
                <a onClick={props.handleSignOut}>Keluar</a>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
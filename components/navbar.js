/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function Navbar(props) {
  return (
    <>
      <div className="navbar bg-primary">
        <div className="flex-1 ">
          <Link href={"/"}>
            <a className="w-48">
              <img className="" src="/logo.png" alt="Evetra" />
            </a>
          </Link>
        </div>
        <div className="flex-none">
          <a className="btn bg-white text-black hover:bg-slate-400 border-0 flex gap-2" onClick={props.handleSignIn}>
            <img src="/logo-google.png" alt="Google" />
            <span className="md:block hidden">
              Masuk dengan Akun Google
            </span>
          </a>
        </div>
      </div>
    </>
  )
}
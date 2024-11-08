import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Obtiene la ruta actual

  const getActiveClass = (paths) => {
    return paths.some(path => 
      path instanceof RegExp 
        ? path.test(location.pathname) 
        : location.pathname === path
    )
      ? "bg-white text-primary -translate-y-4 border-8 border-primary"
      : "text-white";
  };

  return (
   
      <div className="bg-primary bottom-0 w-full fixed shadow-up rounded-t-lg">
        <nav className="container px-12 py-1 max-w-md mx-auto w-full ">
          <ul className="flex w-full justify-center items-center gap-1">
            <li>
              <Link to="/admin" className="flex items-center">
              <i className={`fa-solid fa-house transition-transform rounded-full h-12 w-12  flex justify-center items-center ${getActiveClass(["/admin"])}`}></i>
              </Link>
            </li>
            <li>
              <Link to="/admin/clients" className="flex items-center">
                
                <i className={`fa-solid fa-users transition-transform rounded-full h-12 w-12  flex justify-center items-center ${getActiveClass(["/admin/clients"])}`}></i>
              </Link>
            </li>
            <li>
              <Link to="/admin/services" className="flex items-center">
              <i className={`fa-solid fa-scissors transition-transform rounded-full h-12 w-12  flex justify-center items-center ${getActiveClass(["/admin/services"])}`}></i>
              </Link>
            </li>
            <li>
              <Link to="/admin/work-hours" className="flex items-center">
              <i className={`fa-solid fa-clock transition-transform rounded-full h-12 w-12  flex justify-center items-center ${getActiveClass(["/admin/work-hours"])}`}></i>
              </Link>
            </li>
            <li>
              <Link to="/admin/NonWorkingDaysPage" className="flex items-center">
              <i className={`fa-solid fa-calendar transition-transform rounded-full h-12 w-12  flex justify-center items-center ${getActiveClass(["/admin/NonWorkingDaysPage"])}`}></i>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    
  );
};

export default Footer;


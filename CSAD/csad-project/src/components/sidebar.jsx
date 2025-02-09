import { Link, useLocation } from 'react-router-dom';
import './sidebar.css'

function Sidebar() {
    const location = useLocation();

    const hideSidebarRoutes = ["/login", "/signup", "/forgotpass"];

    if (hideSidebarRoutes.includes(location.pathname)) {
      return null;
    }

    return (
        <div className="sidebar">
          <div className="flex flex-col items-center w-40 h-[100vh] overflow-hidden text-gray-400 bg-[#1c2633] rounded">
            <Link to="/Dashboard" className="flex items-center w-full px-3 mt-3">
              <svg className="" xmlns="http://www.w3.org/2000/svg"  fill="currentColor" width={32} height={40}>
                <path fillRule="evenodd" clipRule="evenodd" d="M 28.2084 19.4796 C 28.2084 25.5528 23.628 30.6327 17.5 31.903 V 18.5006 H 11.5 V 31.903 C 5.37204 30.6327 0.791687 25.5528 0.791687 19.4796 C 0.791687 16.271 1.81389 13.4275 3.30004 10.9889 C 5.36905 10.8355 7.00002 9.10824 7.00002 7.00002 C 7.00002 6.80619 6.98623 6.61558 6.95958 6.42911 C 10.3353 3.08726 13.9352 1.16724 14.44 0.906161 C 14.4819 0.88447 14.5181 0.88447 14.5601 0.906161 C 15.5408 1.41347 28.2084 8.18449 28.2084 19.4796 Z"/>
                <circle cx={3} cy={7} r={2} fill="currentColor" />
                <path d="M14.5 36.125V 18.5" strokeWidth={2} stroke="currentColor" />
              </svg>
              <span className="ml-2 text-sm font-bold">ActiveTrack</span>
            </Link>
            <div className="w-full px-2">
              <div className="flex flex-col items-center w-full mt-3 border-t border-gray-700">
                <Link to="/Dashboard" className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
                  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="ml-2 text-sm font-medium">Dashboard</span>
                </Link>
                <Link to="/insights" className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
                  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium">Insights</span>
                </Link>
                <Link to="/events" className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
                  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6.44784 7.96942C6.76219 5.14032 9.15349 3 12 3V3C14.8465 3 17.2378 5.14032 17.5522 7.96942L17.804 10.2356C17.8072 10.2645 17.8088 10.279 17.8104 10.2933C17.9394 11.4169 18.3051 12.5005 18.8836 13.4725C18.8909 13.4849 18.8984 13.4973 18.9133 13.5222L19.4914 14.4856C20.0159 15.3599 20.2782 15.797 20.2216 16.1559C20.1839 16.3946 20.061 16.6117 19.8757 16.7668C19.5971 17 19.0873 17 18.0678 17H5.93223C4.91268 17 4.40291 17 4.12434 16.7668C3.93897 16.6117 3.81609 16.3946 3.77841 16.1559C3.72179 15.797 3.98407 15.3599 4.50862 14.4856L5.08665 13.5222C5.10161 13.4973 5.10909 13.4849 5.11644 13.4725C5.69488 12.5005 6.06064 11.4169 6.18959 10.2933C6.19123 10.279 6.19283 10.2645 6.19604 10.2356L6.44784 7.96942Z" stroke="#AAAAAA" strokeWidth="2"/>
                    <path d="M8 17C8 17.5253 8.10346 18.0454 8.30448 18.5307C8.5055 19.016 8.80014 19.457 9.17157 19.8284C9.54301 20.1999 9.98396 20.4945 10.4693 20.6955C10.9546 20.8965 11.4747 21 12 21C12.5253 21 13.0454 20.8965 13.5307 20.6955C14.016 20.4945 14.457 20.1999 14.8284 19.8284C15.1999 19.457 15.4945 19.016 15.6955 18.5307C15.8965 18.0454 16 17.5253 16 17" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium">Events</span>
                </Link>
                <Link to="/rewards" className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
                  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16.5 20.5H7.5" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M13 18.5C13 19.0523 12.5523 19.5 12 19.5C11.4477 19.5 11 19.0523 11 18.5H13ZM11 18.5V16H13V18.5H11Z" fill="none"/>
                    <path d="M10.5 9.5H13.5" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5.5 14.5C5.5 14.5 3.5 13 3.5 10.5C3.5 9.73465 3.5 9.06302 3.5 8.49945C3.5 7.39488 4.39543 6.5 5.5 6.5V6.5C6.60457 6.5 7.5 7.39543 7.5 8.5V9.5" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18.5 14.5C18.5 14.5 20.5 13 20.5 10.5C20.5 9.73465 20.5 9.06302 20.5 8.49945C20.5 7.39488 19.6046 6.5 18.5 6.5V6.5C17.3954 6.5 16.5 7.39543 16.5 8.5V9.5" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16.5 11.3593V7.5C16.5 6.39543 15.6046 5.5 14.5 5.5H9.5C8.39543 5.5 7.5 6.39543 7.5 7.5V11.3593C7.5 12.6967 8.16841 13.9456 9.2812 14.6875L11.4453 16.1302C11.7812 16.3541 12.2188 16.3541 12.5547 16.1302L14.7188 14.6875C15.8316 13.9456 16.5 12.6967 16.5 11.3593Z" stroke="#AAAAAA" strokeWidth="2"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium">Rewards</span>
                </Link>
              </div>
              <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700">
                <Link to="/community" className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
                  <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium">Community</span>
                </Link>
              </div>
            </div>
            <Link to="/account" className="flex items-center justify-center w-full h-16 mt-auto bg-gray-800 hover:bg-gray-700 hover:text-gray-300">
              <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-2 text-sm font-medium">Account</span>
            </Link>
          </div>
        </div>
    );
    }

export default Sidebar;
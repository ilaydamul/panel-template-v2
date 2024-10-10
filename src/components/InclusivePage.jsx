import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import Content from "../layout/Content";

export default function InclusivePage({ name, title, children }) {
  const { user, setLoad } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    setLoad(false);
  }, [user, setLoad]);

  return (
    <>
      <Sidebar isOpen={isOpen} />
      <div className="content_flex">
        <Topbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="content">
          <Content>
            <h1 className="mb-4">{name}</h1>
            {children}
          </Content>
        </div>
      </div>
    </>
  );
}

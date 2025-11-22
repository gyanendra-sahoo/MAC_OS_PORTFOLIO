import dayjs from "dayjs";
import { navLinks as data, navIcons } from "#constants"

const Navbar = () => {
  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Gyanendra's Portfolio</p>

        <ul>
          {data.map((item) => (
            <li key={item.id}>
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {
            navIcons.map((icon) => (
              <li key={icon.id}>
                <img src={icon.img} alt={`icon-${icon.id}`} className="icon-hover" />
              </li>
            ))
          }
        </ul>

        <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;

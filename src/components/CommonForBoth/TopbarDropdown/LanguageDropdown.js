import React, { useState } from 'react';
import {Dropdown,DropdownToggle,DropdownMenu,DropdownItem} from 'reactstrap';

//i18n
import i18n from '../../../i18n';
import { withNamespaces } from 'react-i18next';

// falgs
import usFlag from "../../../assets/images/flags/us.jpg";
import spain from "../../../assets/images/flags/spain.jpg";
import germany from "../../../assets/images/flags/germany.jpg";
import italy from "../../../assets/images/flags/italy.jpg";
import russia from "../../../assets/images/flags/russia.jpg";
import india from "../../../assets/images/flags/india.png";

const LanguageDropdown = ({ t }) => {
  const [menu, setMenu] = useState(false);
  const [lng, setLng] = useState("India");
  const [flag, setFlag] = useState(india);

  const toggle = () => {
    setMenu(prevMenu => !prevMenu);
  };

  const changeLanguageAction = (lng) => {
    //set the selected language to i18n
    i18n.changeLanguage(lng);

    if (lng === "sp") {
      setLng("Spanish");
      setFlag(spain);
    } else if (lng === "gr") {
      setLng("German");
      setFlag(germany);
    } else if (lng === "ind") {
      setLng("India");
      setFlag(india);
    } else if (lng === "rs") {
      setLng("Russian");
      setFlag(russia);
    } else if (lng === "it") {
      setLng("Italian");
      setFlag(italy);
    } else if (lng === "eng") {
      setLng("English");
      setFlag(usFlag);
    }
  }

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-none d-sm-inline-block">
        <DropdownToggle tag="button" className="btn header-item waves-effect">
          <img className="" src={flag} alt="Header Language" height="16" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">

          <DropdownItem active={lng === "English" ? true : false} onClick={() => changeLanguageAction('eng')} className="notify-item">
            <img src={usFlag} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('English')}</span>
          </DropdownItem>

          <DropdownItem active={lng === "India" ? true : false} onClick={() => changeLanguageAction('ind')} className="notify-item">
            <img src={india} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('India')}</span>
          </DropdownItem>

          <DropdownItem active={lng === "Spanish" ? true : false} onClick={() => changeLanguageAction('sp')} className="notify-item">
            <img src={spain} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Spanish')}</span>
          </DropdownItem>

          <DropdownItem active={lng === "German" ? true : false} onClick={() => changeLanguageAction('gr')} className="notify-item">
            <img src={germany} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('German')}</span>
          </DropdownItem>

          <DropdownItem active={lng === "Italian" ? true : false} onClick={() => changeLanguageAction('it')} className="notify-item">
            <img src={italy} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Italian')}</span>
          </DropdownItem>

          <DropdownItem active={lng === "Russian" ? true : false} onClick={() => changeLanguageAction('rs')} className="notify-item">
            <img src={russia} alt="user" className="me-1" height="12" /> <span className="align-middle">{t('Russian')}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withNamespaces()(LanguageDropdown);

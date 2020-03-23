import React from "react";
import Dropzone from "react-dropzone";
//Подключаем redux
import { connect } from "react-redux";
import { setModalWindowState } from "../../Store/actions/globalModalWindow";
import { updateWallpapers } from "../../Store/actions/userSettings";
import { setCurrentUser } from "../../Store/actions/currentUser";
import { login } from "../../Store/actions/app";
//Импортируем компоненты
import Button from "../../Components/Button/Button";
import Lable from "../../Components/Lable/Lable";
//CSS
import "./Settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundImage: [],
      backgroundImageMessage:
        "Перетащите png или jpg файл или кликните для выбора. Максимальный размер файла — 3 мегабайта."
    };
  }

  onDrop(acceptedFiles) {
    if (typeof acceptedFiles[0] === "undefined") {
      this.setState({
        backgroundImageMessage:
          "Файл не поддерживается. Попробуйте другой файл."
      });
    } else {
      this.props.updateWallpapers(acceptedFiles[0]);
      this.setState({ backgroundImageMessage: "Файл успешно загружен!" });
    }
  }

  render() {
    return (
      <form onClick={event => event.stopPropagation()}>
        <h1 className="h1">Настройки</h1>
        <Lable>Изменение обоев</Lable>
        <Dropzone
          onDrop={acceptedFiles => this.onDrop(acceptedFiles)}
          accept="image/png, image/jpeg"
          minSize={0}
          maxSize={3145728}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="loadWallpapersBox" {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="loadBackgroundArea">
                  {this.state.backgroundImageMessage}
                </p>
              </div>
            </section>
          )}
        </Dropzone>
        <Button
          isPrimary
          value="Закрыть"
          onClick={() => this.props.setModalWindowState(false)}
        />
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    token: state.token,
    authError: state.authError,
    userSettings: state.userSettings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => {
      dispatch(setCurrentUser(user));
    },
    login: () => {
      dispatch(login());
    },
    setModalWindowState: boolean => {
      dispatch(setModalWindowState(boolean));
    },
    updateWallpapers: file => {
      dispatch(updateWallpapers(file));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

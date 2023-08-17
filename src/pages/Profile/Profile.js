import "./Profile.css";

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  getUserPhotos,
  publishPhoto,
  resetMessage,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user); //Usuario com o id na URL -> Um usuario pode ver o perfil de outro usuario
  const { user: userAuth } = useSelector((state) => state.auth); //Usuario autenticado no momento -> Pode ou não ser igual ao user acima
  const {
    photos, 
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);
  
  const [title, setTitle] = useState();
  const [image, setImage] = useState();

  const [editId, setEditId] = useState();
  const [editImage, setEditImage] = useState();
  const [editTitle, setEditTitle] = useState();

  // New form and edit form refs - obtem os elementos a nivel de DOM para manipula-los
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id)); //Chama o Slice que chama o Service que chama a API
    dispatch(getUserPhotos(id)); //vai preencher o photos - Chama o Slice que chama o Service que chama a API
     
}, [dispatch, id]);

  // Reset component message -  depois de 2s, reseta a mensagem da tela
  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  }

  // Publish a new photo
  const submitHandle = (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image,
    };

    // build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData)); //Chama o Slice que chama o Service que chama a API

    setTitle("");

    resetComponentMessage();
  };

  // change image state
  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  // Exclude an image
  const handleDelete = (id) => {
    dispatch(deletePhoto(id)); //Chama o Slice que chama o Service que chama a API

    resetComponentMessage();
  };

  // Esconder ou mostrar forms
  function hideOrShowForms() {
    newPhotoForm.current.classList.toggle("hide"); //Ou fica o formulario de edica ou o de criacao de foto
    editPhotoForm.current.classList.toggle("hide"); //Nunca ficam os dois forms ao mesmo tempo
  }

  // Show edit form - chaca se o form de edicao de foto está oculto, se estiver, mostro ele 
  const handleEdit = (photo) => { 
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    //Se tiver em outra foto, basta recarregar os dados com a nova foto
    setEditId(photo._id);
    setEditImage(photo.image);
    setEditTitle(photo.title);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  // Update photo title
  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId,
    };

    dispatch(updatePhoto(photoData));

    resetComponentMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && ( //Verifica se o id da URL é o id do usuario autenticado
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={submitHandle}>
              <label>
                <span>Título para a foto:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" disabled value="Aguarde..." />
              )}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos &&
            photos?.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === userAuth._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo._id)} />
                  </div>
                ) : (
                  <Link className="btn" to={`/photos/${photo._id}`}>
                    Ver
                  </Link>
                )}
              </div>
            ))}
          {photos.length === 0 && <p>Ainda não há fotos publicadas...</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { api, requestConfig } from "../utils/config";

// Register a user
const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res) {
      localStorage.setItem("user", JSON.stringify(res)); //Salva localmente o token retornado do back pra ver se o usuario tá logado depois
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

//Logout do usuário - Remover o token do localStorage
const logout = () => {
    localStorage.removeItem('user')
}


// Sign in - Login do usuario
const login = async (data) => {
    const config = requestConfig("POST", data);
  
    try {
      const res = await fetch(api + "/users/login", config)
        .then((res) => res.json())
        .catch((err) => err);

      if (res._id) { //Só salva se o login foi bem sucedido e retornou um _id (junto com o token)
        localStorage.setItem("user", JSON.stringify(res));
      }
  
      return res;
    } catch (error) {
      console.log(error);
    }
};

const authService = {
  register,
  logout,
  login,
};

export default authService;

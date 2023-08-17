import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Publish an user's photo
export const publishPhoto = createAsyncThunk(
    "photo/publish",
    async (photo, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
  
      const data = await photoService.publishPhoto(photo, token);
  
      console.log(data.errors);
      // Check for errors
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
  
      return data;
    }
  );

  // Get todas as fotos do usuario
export const getUserPhotos = createAsyncThunk(
    "photo/userphotos",
    async (id, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
  
      const data = await photoService.getUserPhotos(id, token);
            
      return data;
    }
  );

// Deletar uma photo
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    console.log(data.errors);
    // Checagem de erros
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Update da photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get photo
export const getPhoto = createAsyncThunk("photo/getphoto", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.getPhoto(id, token);

  return data;
});

// Like a photo
export const like = createAsyncThunk("photo/like", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.like(id, token);

  // Check for errors
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

// Add comment to a photo
export const comment = createAsyncThunk(
  "photo/comment",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.comment(
      { comment: photoData.comment },
      photoData.id,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get all photos - Observe que no async eu nao tenho dados para passar, entao coloco um _ e o react entende que o argumento é dispensavel
export const getPhotos = createAsyncThunk("photo/getall", async (_, thunkAPI) => {
  
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.getPhotos(token);

  return data;
});

// Search photos by title
export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.searchPhotos(query, token);

    console.log(data);
    console.log(data.errors);

    return data;
  }
);

export const photoSlice = createSlice({
    name: "publish",
    initialState,
    reducers: {
      resetMessage: (state) => {
        state.message = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(publishPhoto.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(publishPhoto.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photo = action.payload;
          state.photos.unshift(state.photo); //Add a foto no primeiro lugar no array de fotos do usuario -> pra mostrar primeiro
          state.message = "Foto publicada com sucesso!";
        })
        .addCase(publishPhoto.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.photo = {};
        })
        .addCase(getUserPhotos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUserPhotos.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photos = action.payload;
        })
        .addCase(deletePhoto.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deletePhoto.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photos = state.photos.filter((photo) => {
            return photo._id !== action.payload.id;
          }); //Muda logo o array de fotos sem precisar fazer mais uma requisicao no sistema pra pegar as fotos atualizadas
  
          state.message = action.payload.message; //Mostra a mensagem da API
        })
        .addCase(deletePhoto.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.photo = null;
        })
        .addCase(updatePhoto.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updatePhoto.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
  
          state.photos.map((photo) => {
            if (photo._id === action.payload.photo._id) {
              return (photo.title = action.payload.photo.title); //Atualiza o titulo da foto, sem precisar fazer uma nova requisicao
            }
            return photo;
          });
  
          state.message = action.payload.message;
        })
        .addCase(updatePhoto.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.photo = null;
        })
        .addCase(getPhoto.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getPhoto.fulfilled, (state, action) => {
          console.log(action.payload);
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photo = action.payload;
        })
        .addCase(like.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          
          //Atualizacao na Foto individual
          if (state.photo.likes) {
            state.photo.likes.push(action.payload.userId);
          } //Faz a atualizacao no array de likes com foto individual
          
          //Atualizacao nas Fotos na Home
          state.photos.map((photo) => {
            if (photo._id === action.payload.photoId) {
              return photo.likes.push(action.payload.userId);
            }
            return photo;
          }); //Faz a atualizacao quando eu tenho varias fotos, como por exemplo, na Home
  
          state.message = action.payload.message;
        })
        .addCase(like.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(comment.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
  
          state.photo.comments.push(action.payload.comment); //push() insere no final do array, como normalmente ocorre os comentarios mais novos vao para o final
  
          state.message = action.payload.message;
        })
        .addCase(comment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getPhotos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getPhotos.fulfilled, (state, action) => {
          console.log(action.payload);
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photos = action.payload;
        })
        .addCase(searchPhotos.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(searchPhotos.fulfilled, (state, action) => {
          console.log(action.payload);
          state.loading = false;
          state.success = true;
          state.error = null;
          state.photos = action.payload;
        });
    },
  });
  
  export const { resetMessage } = photoSlice.actions;
  export default photoSlice.reducer;
  
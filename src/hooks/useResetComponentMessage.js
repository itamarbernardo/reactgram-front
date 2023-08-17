// Redux
import { resetMessage } from "../slices/photoSlice";

//Vai sumir com a mensagem da tela após 2s
export const useResetComponentMessage = (dispatch) => {
  return () => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
};

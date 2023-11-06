import { ACCOUNT_VF_ERROR, ACCOUNT_VF_SUCCESS } from "./actionType";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import { url as mainURL} from "../../config/apiCalls";

export function accountVf(tokenParam, requestConfigToken) {
  const requestConfig = {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      // "Token": "test",
    },
  };

  const url =
  mainURL+"user/signup/verify?token=";
  return (dispatch) => {
    let apiUrl = url + tokenParam; //`${apiConfig.signup.url}`;
    console.log(apiUrl);
    return axios
      .get(apiUrl, requestConfigToken)
      .then((response) => {
        dispatch(handleAccountVfSuccess(response));
      })
      .catch((error) => {
        dispatch(handleAccountVfError(error));
      });
  };
}

export function handleAccountVfError(record) {
  return {
    type: ACCOUNT_VF_ERROR,
    record,
  };
}

export function handleAccountVfSuccess(record) {
  return {
    type: ACCOUNT_VF_SUCCESS,
    record,
  };
}

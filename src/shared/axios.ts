import axios from "axios";
import { MOVIE_API_URL, LANGUAGE } from "./constants";

export const API_KEY = "45182786638fe524a433bd5af884766c";

const instance = axios.create({
  baseURL: MOVIE_API_URL,
  params: {
    api_key: API_KEY,
    language: LANGUAGE,
    without_original_language: "zh,ko,hi,in,jp", // Removido aspas extras e vírgulas extras
    "vote_average.gte": 5, // Alterado para string para compatibilidade com URL
  },
});

export default instance;

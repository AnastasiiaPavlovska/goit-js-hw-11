import axios from 'axios';

const API_KEY = 'key=38536697-e893b9b28b2dbccb55a145c33';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
    }

    async fetchImg() {
        const url = `${BASE_URL}?${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

        const data = await axios.get(url).then(({data}) => data);
        this.incrementPage();
        return data
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }

}
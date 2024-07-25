const prod = {
  url: {
    API_BASE_URL: 'https://myapp.herokuapp.com',
  }
}

const dev = {
  url: {
    API_BASE_URL: 'http://192.168.1.5:8080'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod
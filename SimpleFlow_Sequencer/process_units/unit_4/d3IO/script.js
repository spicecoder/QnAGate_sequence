const clickHandle = () => {
    axios.get('https://localhost:8080/sample.html')
        .then(response => {
            //const users = response.data.data;
            console.log(`data received'+ response.data);
        })
        .catch(error => console.error(error));
};

///https://attacomsian.com/blog/axios-javascript
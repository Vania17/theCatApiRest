const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
});
api.defaults.headers.common['X-API-KEY'] = 'abd26e77-7ae8-4a94-a862-9e530e81244f';

const URL_RANDOM = (num) => `https://api.thecatapi.com/v1/images/search?limit=${num}`;
const URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=abd26e77-7ae8-4a94-a862-9e530e81244f`;
const URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const addArray = [];

const myButton01 = document.querySelector('#myButton01');
const myButton02 = document.querySelector('#myButton02');
const myButton03 = document.querySelector('#myButton03');

const myimg01 = document.querySelector('.type-img1');
const myimg02 = document.querySelector('.type-img2');
const myimg03 = document.querySelector('.type-img3');

const spanError = document.getElementById('error');
// fetch(URL)
//     .then(response=>response.json())
//     .then(data=>{
    //         let myCat = data[0].url;
    //         img.src = myCat
    // })
    //     .catch(error=>console.log(error))

const img = document.querySelectorAll('.imagen');

async function loadRandomMichis(imagen){
    const response = await fetch(URL_RANDOM(3));
    const data = await response.json();

    if(response.status !==200){
        spanError.innerHTML = "Hubo un error "+ response.status
    }else{
        const btnSave1 = document.getElementById('btnSave1');  
        const btnSave2 = document.getElementById('btnSave2');  
        const btnSave3 = document.getElementById('btnSave3');

        img.forEach((ev,index)=>{
            ev.src = data[index].url
        })
        btnSave1.onclick = ()=> {
            saveFavoriteMichi(data[0].id);
            changeRandomMichis(myimg01,true);
        }
        btnSave2.onclick = ()=> {
            saveFavoriteMichi(data[1].id);
            changeRandomMichis(myimg02,true);
        }
        btnSave3.onclick = ()=> {
            saveFavoriteMichi(data[2].id);
            changeRandomMichis(myimg03,true);
        }
    }
}

loadRandomMichis(img);

async function loadFavoriteMichis(){
    const response = await fetch(URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'abd26e77-7ae8-4a94-a862-9e530e81244f',
        },
    });
    const data = await response.json();

    if(response.status !==200){
        spanError.innerHTML = "Hubo un error "+ response.status;
    }else{
        const section = document.getElementById('favoriteMichis');
        
        section.innerHTML = "";
        const h1 = document.createElement('h2');
        const h1Text = document.createTextNode('Michis favoritos');
        h1.appendChild(h1Text);
        h1.className = "text-center m-4 title";
        section.appendChild(h1);

        data.forEach(michi =>{
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Quitar michi');

            img.src = michi.image.url;
            img.height = 300;
            img.className = "type-img2 imagen-favorite";
            btn.appendChild(btnText);
            btn.className = "btn delete change-button mt-2";
            btn.onclick = ()=> deleteFavoriteMichi(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            article.className ="mt-2 mb-3 type-img col-12 col-sm-6 col-md-3 d-flex flex-column justify-content-center";
            section.appendChild(article);
            section.classList = "row";
        });

    }
}
loadFavoriteMichis()

async function saveFavoriteMichi(id){

    const {data, status} = await api.post('/favourites',{
        image_id: id
    });
    // const response = await fetch(URL_FAVORITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type':'application/json',
    //         'X-API-KEY': 'abd26e77-7ae8-4a94-a862-9e530e81244f',
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // });
    // const data = await response.json();

    if(status !== 200){
        spanError.innerHTML = "Hubo un error "+ status+data.message
    }else{
        console.log('Michi guardado en favoritos');
        loadFavoriteMichis();
    }
}

async function changeRandomMichis(imagen, bool){
    if(bool === true){
        loadRandomMichis(imagen, true)
    }else{
        loadRandomMichis(img, false)

    }
}

async function deleteFavoriteMichi(id){
    const response = await fetch(URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
    });
    const data = await response.json();

    if(response.status !== 200){
        spanError.innerHTML = "Hubo un error "+ response.status + data.message;
    }else{
        console.log('Michi eliminado de favoritos');
        loadFavoriteMichis();
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    const response = await fetch(URL_UPLOAD,{
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'abd26e77-7ae8-4a94-a862-9e530e81244f',
        },
        body: formData,
    })
    const data = await response.json();

    if(response.status !== 201){
        spanError.innerHTML = "Hubo un error "+ response.status+data.message
    }else{
        const previewImg = document.getElementById("previewImg");
        console.log('Foto de michi subida');
        loadFavoriteMichis();
        saveFavoriteMichi(data.id, previewImg);
        previewImg.style.setProperty('display','none')

    }
}

const previewImage = () =>{
    console.log("funciona")
    const file = document.getElementById("file").files;
    const previewImg = document.getElementById("previewImg");
    previewImg.style.setProperty('display','block')
    console.log(file)
    if(file.length > 0 ){
            const fileReader = new FileReader();
            fileReader.onload = function(e){
                document.getElementById("previewImg").setAttribute("src", e.target.result);
            }
            fileReader.readAsDataURL(file[0]);
    }
}

const loadingSpin = () =>{
    
}
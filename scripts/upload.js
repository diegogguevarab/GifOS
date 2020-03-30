let api_key = "IWB9of7ygJb0WWAgRTMeezlS93OSNhKx";
let camStream = null;
let recorder = null;
let recording = false;
let duration = '';
let length = 0;
let blob = null;
let gif_url = null;
let main_container = document.getElementById("container");
let mine = document.getElementById("mine");
let style = document.getElementById('page_style');
let logo = document.getElementById("logo");
let arrow = document.getElementById("arrow");
let checkStyle = () => {
    if (localStorage.getItem("theme") === "dark") {
        style.setAttribute("href", "main_dark.min.css");
        logo.setAttribute("src", "images/gifOF_logo_dark.png");
        arrow.setAttribute("src", "images/arrow_dark.svg");
    } else {
        style.setAttribute("href", "main_day.min.css");
        logo.setAttribute("src", "images/gifOF_logo.png");
        arrow.setAttribute("src", "images/arrow.svg");
    }
};
let getMyGifs = () => {
    mine.innerHTML =
        `<p id="my_gifs_label" class="section_label">Mis Gifs:</p>
        <section id="my_gifs"></section>`;
    let gifs_ids = localStorage.getItem("ids");
    fetch(`https://api.giphy.com/v1/gifs?ids=${gifs_ids}&api_key=${api_key}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.data);
            let section = document.getElementById("my_gifs");
            fill_section(data.data, section);
        }).catch((error) => {
        console.log(error)
    });
};
let fill_section = (data, section) => {
    for (const gif of data) {
        let img = document.createElement("img");
        let gif_div = document.createElement("div");
        img.setAttribute("src", gif.images.downsized_medium.url);
        img.setAttribute("alt", gif.title);
        gif_div.setAttribute("class", "gif");
        gif_div.appendChild(img);
        section.appendChild(gif_div);
    }
};
let initIntro = () => {
    main_container.innerHTML =
        `<b class="header-bar">Crear Gifos</b>
        <section id="section-create">
            <div class="header-window">
                <img src="images/window_img.png" alt="ico window">
                <h2>
                    Aquí podrás crear tus propios Gifos
                </h2>
            </div>
            <div class="content-window">
                <p>
                    Crear tu guifo es muy fácil, graba cualquier imagen con tu cámara y obtén guifos
                    personalizados. Los pasos para crear tu guifo son:
                </p>
                <br/>
                <ul>
                    <li>Dar permisos de acceso a la cámara (sólo por el tiempo de uso)</li>
                    <li>Capturar tu momento guifo</li>
                    <li>Revisar el momento</li>
                    <li>Listo para subir y compartir!</li>
                </ul>
                <h2>
                    ¿Quieres comenzar a crear tu guifo ahora?
                </h2>
            </div>
            <div class="right-bottom-btn">
                <button id="btn_cancel" class="btn-secondary" onclick="location.href='index.html'">Cancelar</button>
                <button id="btn_record" onclick="initCamera()">Comenzar</button>
            </div>
        </section>`;
    getMyGifs();

};
let initCamera = () => {
    main_container.innerHTML =
        `<b id="window_title" class="header-bar">Un Chequeo Antes de Empezar</b>
        <section id="section-record">
            <video id="video_container"
                   style="width:35rem;height:26.375rem;margin-bottom:0.5rem;padding:3px;background: white;border: 1px solid #979797;box-shadow: inset -2px -2px 0 0 #e6e6e6, inset 2px 2px 0 0 black;"></video>
            <div id="record_div" class="right-bottom-btn">
                <button id="btn_camera" onclick="initRecording()"><img id="ico_cam" src=${localStorage.getItem("theme") === "dark" ? "images/camera_dark.svg" : "images/camera.svg"} alt="camera"></button>
                <button id="btn_record" onclick="initRecording()">Capturar</button>
            </div>
        </section>`;
    mine.innerHTML = "";
    checkStyle();
    startCamera();
};
let initRecording = () => {
    document.getElementById("window_title").innerHTML = "Capturando Tu Gif";
    document.getElementById("record_div").classList.remove("right-bottom-btn");
    document.getElementById("record_div").classList.add("recording-bottom");
    document.getElementById("record_div").innerHTML =
        `<p id="timer" class="search_text"></p>
        <div class="right-bottom-btn">
            <button id="btn_rec" onclick="initPreview()"><img id="ico_rec" src=${localStorage.getItem("theme") === "dark" ? "images/recording_dark.svg" : "images/recording.svg"} alt="recording"></button>
            <button id="btn_stop" onclick="initPreview()">Listo</button>
        </div>`;
    checkStyle();
    recordGif();
    clock();
};
let initPreview = () => {
    recording = false;
    recorder.stopRecording(stopRecorder);
    camStream.getTracks().forEach(track => track.stop());
};
let stopRecorder = () => {
    blob = recorder.getBlob();
    recorder.destroy();
    recorder = null;
    main_container.innerHTML =
        `<b id="window_title" class="header-bar">Vista Previa</b>
        <section id="section-record">
            <img id="gif_container" class="gif-container" style="width:35rem;height:26.375rem;margin-bottom:0.5rem;padding:3px;background: white;border: 1px solid #979797;box-shadow: inset -2px -2px 0 0 #e6e6e6, inset 2px 2px 0 0 black;"/>
            <div id="record_div" class="recording-bottom">
                <p id="timer" class="search_text">${duration}</p>
                <button id="btn_forward"><img src="images/forward.svg"></button>
                <div id="progress_bar_preview" class="progress-bar"></div>
                <div>
                    <button id="btn_repeat" class="btn-secondary" onclick="initCamera()">Repetir Gif</button>
                    <button id="btn_upload" onclick="initUpload()">Subir</button>
                </div>
            </div>
        </section>`;
    document.getElementById("gif_container").src = URL.createObjectURL(blob);
    putProgressBar("progress_bar_preview");
    activateBar("progress_bar_preview");
};
let initUpload = () => {
    main_container.innerHTML =
        `<b id="window_title" class="header-bar">Subiendo Gif</b>
        <section id="section-record">
            <div id="uploading-container">
                <img src="images/globe_img.png" alt="world" />
                <h2>Estamos subiendo tu gifo...</h2>
                <div id="progress_bar_upload" class="progress-bar"></div>
                <p>Tiempo restante: <span class="crossed">38 años</span> algunos minutos</p>
            </div>
            <div id="record_div" class="right-bottom-btn">               
                 <button id="btn_cancel" class="btn-secondary" onclick="initOutro()">Cancelar</button>
            </div>
        </section>`;
    putProgressBar("progress_bar_upload");
    activateBar("progress_bar_upload");
    upload();
};
let initOutro = () => {
    main_container.innerHTML = `
    <b id="window_title" class="header-bar">Gif Subido con Éxito</b>
    <div id="section-outro">
        <div class="left-container">
            <img id="preview_gif_container" style="width:23rem;height:15rem;margin-bottom:0.5rem;padding:3px;background: white;border: 1px solid #979797;box-shadow: inset -2px -2px 0 0 #e6e6e6, inset 2px 2px 0 0 black;"/>
        </div>
        <div class="right-container">
            <h2>Gifo creado con éxito</h2>
            <button id="btn_copy_link" class="btn-secondary" onclick="putClipboard()">Copiar Enlace Gifo</button>
            <button id="btn_download_gif" class="btn-secondary" onclick="downloadGif()">Descargar Gifo</button>
        </div>
    </div>
    <div id="outro_div" class="right-bottom-btn">
            <button id="btn_done" onclick="location.href='index.html'">Listo</button>
    </div>`;
    getLastGif();
    getMyGifs();
};
let putClipboard = () => {
    navigator.clipboard.writeText(gif_url).then(() => {
        alert("El link ha sido copiado en el portapapeles!");
    }).catch(error => {
        console.log(error)
    });
};
let downloadGif = () => {
    invokeSaveAsDialog(blob, "MyGif.gif");
}
let getLastGif = () => {
    let last_gif = localStorage.getItem("lastUpload");
    fetch(`https://api.giphy.com/v1/gifs/${last_gif}?api_key=${api_key}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.data);
            let img = document.getElementById("preview_gif_container");
            img.setAttribute("src", data.data.images.downsized_medium.url);
            img.setAttribute("alt", data.data.title);
            gif_url = data.data.url;
        }).catch((error) => {
        console.log(error)
    });
};
let startCamera = () => {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then((stream) => {
        camStream = stream;
        document.getElementById("video_container").srcObject = stream;
        document.getElementById("video_container").play()
    }).catch(error => {
        alert('Necesitamos los permisos para que grabes tu Gif :(');
        console.log(error);
    });
};
let startUpload = () => {
    checkStyle();
    initIntro();
};
let recordGif = () => {
    recorder = createGifRecorder(camStream);
    recorder.startRecording();
    recording = true;
};
let createGifRecorder = stream => {
    return RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: () => console.log('started')
    });
};
let upload = async () => {
    const formData = new FormData();
    formData.append('file', blob, 'myGif.gif');
    await fetch(`https://upload.giphy.com/v1/gifs?api_key=${api_key}`, {
        method: 'post',
        body: formData
    }).then(res => res.json()
    ).then(resParsed => {
        const uploadedGifoId = resParsed.data.id;
        localStorage.setItem('lastUpload', uploadedGifoId);
        saveGifInLocalStorage(uploadedGifoId);
        initOutro();
    }).catch(error => {
        console.log(error);
    });
};
let saveGifInLocalStorage = gifoID => {
    let savedGifs = localStorage.getItem('ids');
    savedGifs != null ? localStorage.setItem('ids', `${savedGifs},${gifoID}`) : localStorage.setItem('ids', gifoID);
};
let activateBar = id => {
    let i = 0;
    let parts = document.querySelectorAll(`#${id} .progress-bar-part`);
    setInterval(() => {
        if (i < parts.length) {
            parts[i].classList.remove("progress-bar-part");
            parts[i].classList.add("progress-bar-part-active");
            i++;
        } else {
            i = 0;
            for (const part of parts) {
                part.classList.remove("progress-bar-part-active");
                part.classList.add("progress-bar-part");
            }
        }
    }, id === 'progress_bar_upload' ? 80 : (1000 * length) / parts.length);
};
let putProgressBar = id => {
    if (id === 'progress_bar_upload')
        document.getElementById(id).innerHTML =
            `<div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>`;
    else document.getElementById(id).innerHTML =
        `<div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>
        <div class="progress-bar-part"></div>`;
};
let clock = () => {
    length = 0;
    let segs = 1;
    let mins = 0;
    let timerElement = document.getElementById('timer');
    let timer = setInterval(() => {
        if (recording) {
            if (segs < 60) {
                if (segs <= 9) {
                    segs = '0' + segs;
                }
                duration = `00:0${mins}:${segs}`;
                timerElement.innerHTML = duration;
                console.log(`00:0${mins}:${segs}`);
                segs++;
            } else {
                mins++;
                segs = 0;
            }
            length++;
        } else {
            clearInterval(timer);
        }
    }, 1000);
};
window.onload = startUpload();
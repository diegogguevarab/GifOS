let api_key = "IWB9of7ygJb0WWAgRTMeezlS93OSNhKx";
let endpoint = "trending";
let offset = 0;
let search = "";
let script = "";
let style = document.getElementById('page_style');
let logo = document.getElementById("logo");
let lupa = document.getElementById("search_ico");
let drop = document.getElementById("ico_drop");
let btns_close = null;
document.getElementById("sug1").onclick = () => suggestedSearch(`${sug1.innerHTML}`);
document.getElementById("sug2").onclick = () => suggestedSearch(`${sug2.innerHTML}`);
document.getElementById("sug3").onclick = () => suggestedSearch(`${sug3.innerHTML}`);

let getGifs = (endpoint) => {
    if (endpoint === "trending") {
        offset += 25;
        getTrendingGifs(offset);
    } else {
        offset += 25;
        getSearchGifs(search, offset);
    }
};
let getTrendingGifs = (offset) => {
    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&offset=${offset}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data.data);
            let section = document.getElementById("results_gifs");
            fill_section(data.data, section);
        }).catch((error) => {
        console.log(error);
    })
};
let getSearchGifs = (search, offset) => {
    fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${api_key}&offset=${offset}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.data);
            let section = document.getElementById("results_gifs");
            fill_section(data.data, section);
        }).catch((error) => {
        console.log(error)
    });
};
let getRandomGif = () => {
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=${api_key}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
                console.log(data);
                let section = document.getElementById("recomended_gifs");
                let gif_div = document.createElement("div");
                let title = document.createElement("p");
                let title_text = splitTitle(data.data.title, 2);
                let img = document.createElement("img");
                let btn_more = document.createElement("button");
                let btn_close = document.createElement("img");
                let action_value = '';
                gif_div.setAttribute("class", "gif-recommended");
                title.setAttribute("class", "gif-recommended-title");
                if (title_text === 'undefined' || title_text === '') {
                    title_text = data.data.username;
                }
                title.innerHTML = `#${title_text}`;
                gif_div.appendChild(title);
                img.setAttribute("src", data.data.images.original.url);
                img.setAttribute("alt", data.data.title);
                img.classList.add("gif_img");
                gif_div.appendChild(img);
                btn_more.setAttribute("class", "btn-more");
                btn_more.innerHTML = "Ver más...";
                title_text = splitTitle(data.data.title, 3);
                action_value = title_text === 'undefined' ? data.data.username : title_text === '' ? data.data.username : title_text;
                btn_more.onclick = () => {
                    enableSearch();
                    document.getElementById("search_query").value = action_value;
                    document.getElementById("search_btn").click();
                };
                btn_close.setAttribute("src", "images/close.svg");
                btn_close.setAttribute("class", "btn-close");
                gif_div.appendChild(btn_close);
                gif_div.appendChild(btn_more);
                section.appendChild(gif_div);
            }
        );
};

let fill_section = (data, section) => {
    for (const gif of data) {
        let img = document.createElement("img");
        let caption = document.createElement("p");
        let caption_text = splitTitle(gif.title, 1);
        let gif_div = document.createElement("div");
        img.setAttribute("src", gif.images.downsized_medium.url);
        img.setAttribute("alt", gif.title);
        caption.setAttribute("class", "gif-caption");
        caption.innerHTML = `${caption_text}`;
        gif_div.setAttribute("class", "gif");
        gif_div.appendChild(img);
        gif_div.appendChild(caption);
        section.appendChild(gif_div);
    }
};
let splitTitle = (title_text, spaces) => {
    title_text = title_text.split(' ');
    title_text.map((value, index) => {
        if (value === 'GIF') {
            title_text = title_text.slice(0, index);
        }
    });
    if (spaces === 1) {
        title_text.forEach((value, index) => (title_text[index] = '#' + value));
        title_text = title_text.join(" ");
    } else if (spaces === 2) title_text = title_text.join("");
    else title_text = title_text.join(" ");
    return title_text;
};

document.getElementById("search_btn").onclick = () => {
    offset = 0;
    endpoint = "search";
    document.getElementById("recomendations").innerHTML = '';
    search = document.getElementById("search_query").value;
    document.getElementById("res_label").innerHTML = `${search} (resultados)`;
    let section = document.getElementById("results_gifs");
    section.innerHTML = '';
    location.href = 'index.html#results_gifs';
    getSearchGifs(search, offset);
    disableSearch();
};
let suggestedSearch = search => {
    enableSearch();
    document.getElementById("drop_suge").classList.toggle("active");
    document.getElementById("search_query").value = search;
    document.getElementById("search_btn").click();
};
let dayStyle = () => {
    style.setAttribute("href", "main_day.min.css");
    localStorage.setItem("theme", "day");
    document.getElementById("drop_styles").classList.toggle("active");
    document.getElementById("option_dark").classList.remove("option-active");
    document.getElementById("option_day").classList.add("option-active");
    logo.setAttribute("src", "images/gifOF_logo.png");
    lupa.setAttribute("src", "images/lupa_inactive.svg")
    drop.setAttribute("src", "images/dropdown.svg");
    for (const btn in btns_close) btn.setAttribute("src", "images/close_dark.svg");
};
let darkStyle = () => {
    style.setAttribute("href", "main_dark.min.css");
    localStorage.setItem("theme", "dark");
    document.getElementById("option_dark").classList.add("option-active");
    document.getElementById("option_day").classList.remove("option-active");
    document.getElementById("drop_styles").classList.toggle("active");
    logo.setAttribute("src", "images/gifOF_logo_dark.png");
    lupa.setAttribute("src", "images/lupa_inactive_dark.svg");
    drop.setAttribute("src", "images/dropdown_dark.svg");
    for (const btn in btns_close) btn.setAttribute("src", "images/close.svg");
};
let suggestions = () => {
    if (script !== '') {
        try {
            document.body.removeChild(script);
        } catch (e) {
            console.log(e);
        }
    }
    let input = document.getElementById("search_query").value;
    if (input.length >= 1) {
        enableSearch();
        document.getElementById("drop_suge").classList.add("active");
        script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?output=chrome&callback=autocompleteCallback&q=${input}`;
        document.body.appendChild(script);
    }
};
let autocompleteCallback = data => {
    console.log(data);
    document.getElementById("sug1").innerHTML = data[1][0];
    document.getElementById("sug2").innerHTML = data[1][1];
    document.getElementById("sug3").innerHTML = data[1][2];
};
let activateDrop = () => {
    document.getElementById("drop_styles").classList.toggle("active");
};
let enableSearch = () => {
    document.getElementById("search_btn").removeAttribute("disabled");
    document.getElementById("search_btn").classList.remove("btn-disable");
    if (localStorage.getItem("theme") === "dark") {
        lupa.setAttribute("src", "images/lupa_light.svg");
    } else {
        lupa.setAttribute("src", "images/lupa.svg");
    }
};
let disableSearch = () => {
    document.getElementById("search_btn").setAttribute("disabled", "disabled");
    document.getElementById("search_btn").classList.add("btn-disable");
    document.getElementById("drop_suge").classList.remove("active");
    if (localStorage.getItem("theme") === "dark") {
        lupa.setAttribute("src", "images/lupa_inactive_dark.svg");
    } else {
        lupa.setAttribute("src", "images/lupa_inactive.svg");
    }
};
let checkStyle = () => {
    if (localStorage.getItem("theme") === "dark") {
        style.setAttribute("href", "main_dark.min.css");
        logo.setAttribute("src", "images/gifOF_logo_dark.png");
    } else {
        style.setAttribute("href", "main_day.min.css");
        logo.setAttribute("src", "images/gifOF_logo.png");
    }
};
if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "day");
}
let myGifs = () => {
    document.getElementById("recomendations").innerHTML = '';
    document.getElementsByTagName("header")[0].remove();
    let section = document.getElementById("results_gifs");
    section.innerHTML = '';
    location.href = 'index.html#results_gifs';
    let gifs_ids = localStorage.getItem("ids");
    document.getElementById("res_label").innerHTML = `Mis Gifs`;
    fetch(`https://api.giphy.com/v1/gifs?ids=${gifs_ids}&api_key=${api_key}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data.data);
            for (const gif of data.data) {
                let img = document.createElement("img");
                let gif_div = document.createElement("div");
                img.setAttribute("src", gif.images.downsized_medium.url);
                img.setAttribute("alt", gif.title);
                gif_div.setAttribute("class", "gif");
                gif_div.appendChild(img);
                section.appendChild(gif_div);
            }
        }).catch((error) => {
        console.log(error)
    });
};
let startGifs = () => {
    checkStyle();
    for (let i = 0; i < 5; i++) {
        getRandomGif();
    }
    getTrendingGifs();
    btns_close = document.getElementsByClassName("btn-close");
};
window.onload = startGifs();
$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        getGifs(endpoint);
    }
});

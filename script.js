const last_chosen = {};

const em_parts = {
  happy: {
    face: 2,
    mouth: 10,
    eyes: 10,
    eyebrows: 2,
    other: 3
  },
  sad: {
    face: 2,
    mouth: 7,
    eyes: 5,
    eyebrows: 3,
    other: 1
  },
  angry: {
    face: 2,
    mouth: 1,
    eyes: 1,
    eyebrows: 2,
    other: 1
  }
};

const parts = ["face", "mouth", "eyes", "eyebrows", "other"];

function rand() {
  const eyes_prob = parseInt(document.getElementById("eyes_prob").value);
  const mouth_prob = parseInt(document.getElementById("mouth_prob").value);
  const eyebrows_prob = parseInt(document.getElementById("eyeb_prob").value);
  const other_prob = parseInt(document.getElementById("other_prob").value);
  // const emotion=document.getElementById("emotions").value;
  const emotionSelect = document.getElementById("emotions");
  const selectedEmotion = emotionSelect.value;

  const happy_mix = parseInt(document.getElementById("happy_prob").value);
  const sad_mix = parseInt(document.getElementById("sad_prob").value);
  const angry_mix = parseInt(document.getElementById("angry_prob")?.value || 0);

  const total_mix = happy_mix + sad_mix + angry_mix || 1;
  const prob_distribution = {
    happy: happy_mix / total_mix,
    sad: sad_mix / total_mix,
    angry: angry_mix / total_mix
  };

let random_i={};
for (let i = 0; i < parts.length; i++) {
  const part_id = parts[i];
  const prob = {
    eyes: eyes_prob,
    mouth: mouth_prob,
    eyebrows: eyebrows_prob,
    other: other_prob
  }[part_id] ?? 100;

  let emotion_pick;
  if (selectedEmotion !== "random") {
    emotion_pick = selectedEmotion;
  } else {
    const r = Math.random();
    if (r < prob_distribution.happy) emotion_pick = "happy";
    else if (r < prob_distribution.happy + prob_distribution.sad) emotion_pick = "sad";
    else emotion_pick = "angry";
  }

  const part_count = em_parts[emotion_pick][part_id];

  let r;
  if (prob===0 && last_chosen[part_id]!==undefined) {
    r=last_chosen[part_id];
  } else if (prob < 100) {
    const shouldRandomize = Math.random()*100<prob;
    r=shouldRandomize ? Math.floor(Math.random()*part_count):(last_chosen[part_id]??0);
  } else {
    r=Math.floor(Math.random()*part_count);
  }
  last_chosen[part_id] = r;

  const path = `emojis/${part_id}/${emotion_pick}/${r}.svg`;

  random_i[part_id] = r;
if (part_id === "other") {
  const r_m = random_i["mouth"];
  const container = document.getElementById(part_id);

  if (r_m === 4 && (r === 0 || r === 1 || r === 2)) {
    const img = document.createElement("img");
    img.src = path;
    img.alt = part_id;
    img.style.position = "absolute";
    img.style.width = "100%";
    img.style.height = "100%";

    if (r === 1) {
      img.style.zIndex = "5"; 
    } else if (r === 0) {
      img.style.zIndex = "20";
    } else if (r === 2) {
      img.style.zIndex = "15"; 
    } else {
      img.style.zIndex = "10"; 
    }

    container.innerHTML = "";
    container.appendChild(img);
  } else {
    container.innerHTML = "";
  }
}
  else 
  {
    document.getElementById(part_id).innerHTML=`<img src="${path}" alt="${part_id}"/>`;
  }
}
}

function update_label(slider, labelId) {
document.getElementById(labelId).textContent = slider.value;}



function preload_imgs() {
  for (const emotion in em_parts) {
    const parts = em_parts[emotion];
    for (const part in parts) {
      const count = parts[part];
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `emojis/${part}/${emotion}/${i}.svg`;
      }
    }
  }
}

window.onload = () => {
  preload_imgs();

  const e_mix = document.getElementById("emotion_mix");
  const e_select = document.getElementById("emotions");

  function update_e_mix_visiblity() {
    e_mix.style.display = (e_select.value === "random") ? "flex" : "none";
  }

  e_select.addEventListener("change", update_e_mix_visiblity);
  update_e_mix_visiblity();

  rand();
  randomizeCaptions();
};

const captionData = {
  happy: [
    "Life is good!",
    "Sunshine and smiles!",
    "Feeling great!",
    "Best day ever!"
  ],
  sad: [
    "Not my day...",
    "Feeling blue.",
    "It'll be okay.",
    "Why does it hurt?"
  ],
  angry: [
    "Don't talk to me.",
    "Seriously!?",
    "I'm done with this.",
    "So frustrating!"
  ]
};

function getRandomCaption(emotion) {
  const captions = captionData[emotion] || [];
  return captions[Math.floor(Math.random() * captions.length)];
}

function randomizeCaptions() {
  const separate = document.getElementById("separate_caption_random").checked;
  const emotionSelect = document.getElementById("emotions");
  const allEmotions = Object.keys(captionData);

  let topEmotion, bottomEmotion;

  if (separate) {
    topEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];
    bottomEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];
  } else {
    let emotion = emotionSelect.value;
    if (emotion === "random") {
      emotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];
    }
    topEmotion = bottomEmotion = emotion;
  }

  function getCustomOrRandom(emotion, position) {
    const useRandom = document.getElementById("use_random_captions").checked;

    if (useRandom) {
      return getRandomCaption(emotion);
    }

    const inputId = `custom_${emotion}_${position}`;
    const custom = document.getElementById(inputId);
    if (custom && custom.value.trim()) {
      return custom.value.trim();
    }

    return getRandomCaption(emotion);
  }


  let topCaption = getCustomOrRandom(topEmotion, 'top');
  let bottomCaption = getCustomOrRandom(bottomEmotion, 'bottom');

  if (topCaption === bottomCaption && topEmotion === bottomEmotion) {
    const tries = 5;
    for (let i = 0; i < tries && bottomCaption === topCaption; i++) {
      bottomCaption = getCustomOrRandom(bottomEmotion, 'bottom');
    }
  }

  document.getElementById("topText").textContent = topCaption;
  document.getElementById("bottomText").textContent = bottomCaption;
}
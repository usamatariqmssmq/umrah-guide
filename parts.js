/* =========================================================================
   UMRAH AUDIO GUIDE — ALL CONTENT LIVES HERE

   This one file feeds BOTH pages:
     index.html   (modern version — search, player, offline)
     simple.html  (classic version — big text, everything open)

   Edit only this file when you add parts. Never edit the lists inside
   the two html files.

   n      : part number (required)
   title  : short heading for the part
   topics : the points covered
   audio  : path to the audio file, or null if there is none
   image  : path to a dua / reference picture, or null if there is none
   ladies : "Y" if the part is important for ladies, otherwise "N"
   ========================================================================= */

const PARTS = [
  {
    n: 1,
    title: "Ehram se pehle ke adaab w sunnaten",
    topics: [
      "Aehram se phle ke Adaab W Sunnaten",
      "Aehram ki 2 Nafil",
      "Jo Mastoorat Na-paki ki halat me hain wo bhi Ghusl krengi?",
      "Umrah ki Niyyat kb aur khan karni hai?",
      "Umrah ki Niyyat ka Tareeqah w Words",
      "Talbiyah kb tk parhna hai?",
      "Plane me Umrah ki Niyyat krne se phle Mard w Mastoorat is baat ka khayal rkhen."
    ],
    audio: "audios/part-1.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 2,
    title: "Umrah ki Niyyat ke kalimaat",
    topics: [
      "Umrah ki Niyyat ke Kalimaat (Words)"
    ],
    audio: null,
    image: "images/part-2.jpeg",
    ladies: "N"
  },
  {
    n: 3,
    title: "Mardon aur Mastoorat ka Ehraam",
    topics: [
      "Mardon ka Aehram?",
      "Mastoorat Ka Aehraam?",
      "Aehraam me Mardon ke liye kis kis cheez ki pa-bandi hai aur kis cheez ki Nhi hai?",
      "Aehraam me Mastooraat ke liye kis kis cheez ki pa-bandi hai aur kis cheez ki Nhi hai?",
      "Halat E Aehraam me Mastoorat ka sir (سَر)  pr aek kapra bandhna?",
      "Halat e Aehraam me Mastoorat sir (سَر) ka Masah kese krengi?"
    ],
    audio: "audios/part-3.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 4,
    title: "Ehraam me chadar ya blanket ka mas'alah",
    topics: [
      "Halat E Aehram me Blanket ya chadar body pr lapetna?",
      "Halat E Aehraam me Blanket ya chadar se pairon (پیروں) ko dhanpna (ڈھانپنا)?",
      "Halat E Aehraam me Blanket ya Chadar  face pr dalna? (Ahm tareen)."
    ],
    audio: "audios/part-4.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 5,
    title: "Ehraam ki pa-bandiyan",
    topics: [
      "Aehram ki pa-bandiyan❗❗❗"
    ],
    audio: null,
    image: "images/part-5.jpeg",
    ladies: "N"
  },
  {
    n: 6,
    title: "Makkah sheher pr nazar padne ki Dua",
    topics: [
      "Makkah sheher (شہر) pr jb Nazar pare tb ye Dua parhen."
    ],
    audio: null,
    image: "images/part-6.jpeg",
    ladies: "N"
  },
  {
    n: 7,
    title: "Makkah sheher me dakhil hone ki Dua",
    topics: [
      "Jb Makkah Sheher (شہر) me dakhil ho rhe hon tb ye Dua parhen."
    ],
    audio: null,
    image: "images/part-7.jpeg",
    ladies: "N"
  },
  {
    n: 8,
    title: "Na-paki (periods) me Umrah ki Niyyat",
    topics: [
      "Na-paki (Periods) me Umrah ko Niyyat?",
      "Jb tk paak Nhi ho jatin Aehraam ki pa-bandiyan rhengi.",
      "Paak ho jane ke baad dubarah Meeqat ya Masjid E Aisha Nhi jana."
    ],
    audio: "audios/part-8.ogg",
    image: null,
    ladies: "Y"
  },
  {
    n: 9,
    title: "Masjid e Haram me dakhil hone ka adaab",
    topics: [
      "Masjid e Haram me dakhil hone ka Adaab.",
      "Khana E Ka'abah ko dekhte hi sb se phle ye kalimat pathen."
    ],
    audio: "audios/part-9.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 10,
    title: "Ka'abah dekhte hi parhne wale kalimat",
    topics: [
      "Khana E Ka'abah ko dekhte hi sb se phle ye kalimat parhen."
    ],
    audio: null,
    image: "images/part-10.jpeg",
    ladies: "N"
  },
  {
    n: 11,
    title: "Ka'abah pr pehli nazar ki Dua",
    topics: [
      "In kalimat ko parhne ke baad haath utha kr ab aap khoob dua kren.",
      "Khana E Ka'abah pr jb pehli Nazar pre to konsi Dua Maangi jaye?",
      "Jitni der bhi Dua maangna chahen itni der Dua mangen."
    ],
    audio: "audios/part-11.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 12,
    title: "Ab Talbiyah parhna band karna",
    topics: [
      "Ab Talbiyah parhna band kr denge."
    ],
    audio: "audios/part-12.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 13,
    title: "Iztiba aur Tawaf ki Niyyat",
    topics: [
      "Ab Iztiba krna hai.",
      "Umrah ke Tawaf ki Niyyat krni hai."
    ],
    audio: "audios/part-13.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 14,
    title: "Tawaf ki Niyyat ke kalimat",
    topics: [
      "Umrah ke Tawaf ki Niyyat ke kalimat."
    ],
    audio: null,
    image: "images/part-14.jpeg",
    ladies: "N"
  },
  {
    n: 15,
    title: "Istiqbal ka tareeqa",
    topics: [
      "Niyyat krne ke baad mard aur Mastoorat dono ko Istiqbal krna hai.",
      "Istiqbal ka tareeqa."
    ],
    audio: "audios/part-15.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 16,
    title: "Istilam ka tareeqa",
    topics: [
      "Istiqbal ke baad istilaam krenge.",
      "Istilam ka tareeqa.",
      "Istilam total 9 times Krna hai (tafseel aage aarhi hai)."
    ],
    audio: "audios/part-16.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 17,
    title: "Mastoorat ka Istiqbal aur Istilam",
    topics: [
      "Mastoorat bhi Istiqbal aur istilaam krengi."
    ],
    audio: "audios/part-17.ogg",
    image: null,
    ladies: "Y"
  },
  {
    n: 18,
    title: "Mastoorat aur Iztiba ka farq",
    topics: [
      "Mastoorat Iztiba Nhi krengi.",
      "Iztiba , Istiqbal aur Istilam ke farq ko yaad rkha jaye."
    ],
    audio: "audios/part-18.ogg",
    image: null,
    ladies: "Y"
  },
  {
    n: 19,
    title: "Iztiba aur Ramal ka bayan",
    topics: [
      "Iztiba kise kehte hain?",
      "Iztiba kb se kb tk kiya jayega?",
      "Ramal kise keht hain?",
      "Ramal kitne chakkaron me Kiya jayega?"
    ],
    audio: "audios/part-19.ogg",
    image: null,
    ladies: "N"
  },
  {
    n: 20,
    title: "Mastoorat aur Ramal",
    topics: [
      "Mastoorat Iztiba ki trh Ramal bhi Nhi krengi❗"
    ],
    audio: "audios/part-20.ogg",
    image: null,
    ladies: "Y"
  }
];

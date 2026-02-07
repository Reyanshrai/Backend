import musicModel from "../models/music.model.js";
import albumModel from "../models/album.model.js";
import jwt from "jsonwebtoken";
import uploadFile from "../services/storage.services.js";

export async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString("base64"));

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created Successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

export async function createAlbum(req, res) {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}


export async function getAllMusics(req,res){

    const music = await musicModel.find().limit(1) // .populate give all data apart form id and limit how much result you want to show on ui 

    res.status(200).json({
        message : "Music Fetched successfully",
        music
    })
}

export async function getAllAlbum(req,res){

    const album = await albumModel.find().select("title artist").populate("artist","usernmae email")

    res.status(200).json({
        message : "Album fetched Successfully",
        album
    })
}

export async function getAlbumById(req,res){

    const albumId = req.params.albumId

    const albums = await albumModel.findById(albumId).limit(2)
    .populate("artist","username email").populate("musics")

    res.status(200).json({
        message : "Album fetched Successfully",
        albums
    })
}
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("error", (error) =>
  console.error("Erro na conexão com o MongoDB:", error)
);
mongoose.connection.once("open", () => console.log("Conectado ao MongoDB"));

app.use(express.json());
app.use(cors());

// Defina o modelo do quarto no MongoDB
const RoomSchema = new mongoose.Schema({
  selectedDates: [], 
  selectedRoom: Number, 
  selectedIcons: [], 
  name: String, 
  matricula: Number, 
  statusRoom: String
});

const Room = mongoose.model("Room", RoomSchema);

// Rotas da API

app.post("/api/days", async (req, res) => {
  try {
    const { selectedDates } = req.body;
    const room = new Room({ selectedDates }); 
    await room.save();
    res.status(200).json({ message: "Datas recebidas e salvas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar as datas." });
  }
});

app.get('/api/days', async (req, res) => {
  try {
    const rooms = await Room.find();
    const selectedDates = rooms.map(room => room.selectedDates);
    res.status(200).send({ selectedDates, message: "Datas recebidas e salvas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar datas selecionadas.' });
  }
});

app.post("/api/rooms", async (req, res) => {
  try {
    const { roomNumber, selectedDates } = req.body;
    //atualize o room
    const room = new Room({ roomNumber, selectedDates });
    await room.save();

    res.status(200).json({ message: "Sala escolhida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao selecionar sala." });
  }
});

app.post('/api/selection', async (req, res) => {
  try {
    const { selectedDates, selectedRoom, selectedIcons, name, matricula, statusRoom } = req.body;
    const room = new Room({ selectedDates, selectedRoom, selectedIcons, name, matricula, statusRoom });
    await room.save();
    res.status(200).json({ message: "Dados enviados com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar os dados." });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

import { Container } from "typedi";
import cardService from "../services/cardService";

const cardServiceInstance = Container.get(cardService);

export const getCardBalance = async (req, res, next) => {
  try {
    const { page } = req.query;
    const { Ldbl, cardName, accountNumber, _id } =
      await cardServiceInstance.getCardBalance(req.id, page);

    return res.status(200).json({
      message: "success",
      data: { Ldbl, cardName, accountNumber, _id },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    await cardServiceInstance.createCard(req.id, req.body);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const { id: cardId } = req.params;

    await cardServiceInstance.deleteCard(req.id, cardId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

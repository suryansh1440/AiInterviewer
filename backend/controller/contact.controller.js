import Contacts from "../modals/contact.js";

const getUserContacts = async (req, res, next) => {
  try {
    const contact = await Contacts.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export default getUserContacts;

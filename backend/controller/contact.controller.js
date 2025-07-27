import Contacts from "../modals/contact.modal.js";

// Create a new contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }
    const contact = await Contacts.create({ name, email, message });
    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.log("error in contact controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

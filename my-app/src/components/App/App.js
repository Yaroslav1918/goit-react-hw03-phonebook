import React, { Component } from "react";
import ContactList from "../ContactsList/ContactsList";
import ContactForm from "../ContactForm/ContactForm ";
import Filter from "../Filter/Filter";
import { nanoid } from "nanoid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };
  componentDidMount() {
    const contacts = localStorage.getItem("contacts");
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }
  }

  addContactItem = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };
    const { contacts } = this.state;
    if (
      contacts.some(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      toast(`${name} is already in contacts`);
      return;
    }
    this.setState((prevState) => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };
  onDeleteItem = (itemID) => {
    this.setState((prevstate) => ({
      contacts: prevstate.contacts.filter((item) => item.id !== itemID),
    }));
  };

  getFilterList = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter((item) =>
      item.name.toLowerCase().includes(normalizedFilter)
    );
  };

  onChangeFilter = (e) => {
    this.setState({ filter: e.currentTarget.value });
  };

  render() {
    const { filter } = this.state;
    const visibleItem = this.getFilterList();
    return (
      <>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContactItem} />
        <ToastContainer />
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.onChangeFilter} />
        <ContactList onDeleteItem={this.onDeleteItem} contacts={visibleItem} />
      </>
    );
  }
}

export default App;

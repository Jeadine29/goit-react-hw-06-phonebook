import React, { useState, useEffect, useCallback, useRef } from 'react';
import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import Filter from '../Filter/Filter';
import { nanoid } from 'nanoid';
import styles from './App.module.css';

const LS_KEY = 'deleted_contacts';

const App = () => {
  const [contacts, setContacts] = useState([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ]);
  const [filter, setFilter] = useState('');
  const prevContactsRef = useRef([]);

  useEffect(() => {
    const storedDeletedContacts = localStorage.getItem(LS_KEY);
    if (storedDeletedContacts) {
      const deletedContacts = JSON.parse(storedDeletedContacts);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => !deletedContacts.includes(contact.id))
      );
    }
  }, []);

  useEffect(() => {
    prevContactsRef.current = contacts;
  }, [contacts]);

  useEffect(() => {
    const deletedContacts = contacts
      .filter((contact) => !prevContactsRef.current.some((prevContact) => prevContact.id === contact.id))
      .map((contact) => contact.id);
    localStorage.setItem(LS_KEY, JSON.stringify(deletedContacts));
  }, [contacts]);

  const addContact = useCallback((name, number) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    if (contacts.some((contact) => contact.name === name)) {
      alert(`${name} is already in contacts`);
      return;
    }

    setContacts((prevContacts) => [...prevContacts, contact]);
  }, [contacts]);

  const deleteContact = useCallback((contactId) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== contactId)
    );
  }, []);

  const changeFilter = (e) => {
    setFilter(e.target.value);
  };

  const getFilteredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const filteredContacts = getFilteredContacts();

  return (
    <div className={styles.container}>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={addContact} />
      <h2>Contacts</h2>
      <Filter value={filter} onChange={changeFilter} />
      <ContactList contacts={filteredContacts} onDeleteContact={deleteContact} />
    </div>
  );
};

export default App;
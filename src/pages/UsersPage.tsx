import { useEffect } from 'react';
import * as BUI from '@thatopen/ui';
import { useProjects } from '../hooks/useProjects';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import './UsersPage.css';

export function UsersPage() {
  const { navigation } = useProjects();

  const sidebarComponent = (
    <Sidebar navigationItems={navigation} />
  );

  useEffect(() => {
    BUI.Manager.init();

    // Dati originali degli utenti
    const originalUsersData = [
      { data: { Nome: 'Mario Rossi', Email: 'mario.rossi@azienda.com', Ruolo: 'Project Manager', Dipartimento: 'Ingegneria', Stato: 'Attivo' } },
      { data: { Nome: 'Giulia Bianchi', Email: 'giulia.bianchi@azienda.com', Ruolo: 'BIM Specialist', Dipartimento: 'Progettazione', Stato: 'Attivo' } },
      { data: { Nome: 'Luca Verdi', Email: 'luca.verdi@azienda.com', Ruolo: 'Ingegnere Strutturale', Dipartimento: 'Ingegneria', Stato: 'Attivo' } },
      { data: { Nome: 'Anna Neri', Email: 'anna.neri@azienda.com', Ruolo: 'Architetto', Dipartimento: 'Progettazione', Stato: 'Non attivo' } },
      { data: { Nome: 'Paolo Ferrari', Email: 'paolo.ferrari@azienda.com', Ruolo: 'Site Supervisor', Dipartimento: 'Cantiere', Stato: 'Attivo' } },
      { data: { Nome: 'Giulia Bianchi', Email: 'giulia.bianchi@azienda.com', Ruolo: 'BIM Specialist', Dipartimento: 'Progettazione', Stato: 'Attivo' } },
      { data: { Nome: 'Luca Verdi', Email: 'luca.verdi@azienda.com', Ruolo: 'Ingegnere Strutturale', Dipartimento: 'Ingegneria', Stato: 'Attivo' } },
      { data: { Nome: 'Anna Neri', Email: 'anna.neri@azienda.com', Ruolo: 'Architetto', Dipartimento: 'Progettazione', Stato: 'Non attivo' } },
      { data: { Nome: 'Giulia Bianchi', Email: 'giulia.bianchi@azienda.com', Ruolo: 'BIM Specialist', Dipartimento: 'Progettazione', Stato: 'Attivo' } },
      { data: { Nome: 'Luca Verdi', Email: 'luca.verdi@azienda.com', Ruolo: 'Ingegnere Strutturale', Dipartimento: 'Ingegneria', Stato: 'Attivo' } },
    ];

    // Tabella utenti senza header interno
    const usersTable = document.createElement('bim-table') as BUI.Table;
    usersTable.data = originalUsersData;
    usersTable.className = 'users-table';
    // Rimuovi l'header interno della tabella
    usersTable.setAttribute('hide-header', 'true');

    // Funzione di ricerca
    const filterUsers = (searchTerm: string) => {
      if (!searchTerm.trim()) {
        // Se il campo è vuoto, mostra tutti gli utenti
        usersTable.data = originalUsersData;
        return;
      }

      const filteredData = originalUsersData.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const nome = user.data.Nome.toLowerCase();
        const email = user.data.Email.toLowerCase();
        const ruolo = user.data.Ruolo.toLowerCase();
        const dipartimento = user.data.Dipartimento.toLowerCase();
        const stato = user.data.Stato.toLowerCase();

        return nome.includes(searchLower) || 
               email.includes(searchLower) || 
               ruolo.includes(searchLower) || 
               dipartimento.includes(searchLower) || 
               stato.includes(searchLower);
      });

      usersTable.data = filteredData;
    };

    // Header con searchbar
    const header = document.createElement('div');
    header.className = 'users-page-header-inner';
    
    const headerTitle = document.createElement('div');
    headerTitle.className = 'users-page-header-title';
    headerTitle.textContent = 'USERS';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'users-page-search-container';
    
    const searchInput = document.createElement('bim-text-input') as any;
    searchInput.setAttribute('label', 'Search users...');
    searchInput.setAttribute('placeholder', 'insert name, email or role...');
    searchInput.className = 'users-page-search-input';
    
    searchContainer.appendChild(searchInput);
    header.appendChild(headerTitle);
    header.appendChild(searchContainer);

    // Aggiungi event listener per la ricerca
    setTimeout(() => {
      const searchInputElement = header.querySelector('bim-text-input');
      if (searchInputElement) {
        searchInputElement.addEventListener('input', (event: any) => {
          const searchTerm = event.target.value || '';
          filterUsers(searchTerm);
        });
      }
    }, 100);

    // Sidebar dinamica
    const sidebar = document.createElement('div');
    sidebar.className = 'users-page-sidebar-inner';
    sidebar.innerHTML = `
      <div class="users-page-sidebar-title">SIDEBAR</div>
    `;
    const addBtn = document.createElement('bim-button');
    addBtn.setAttribute('label', 'Aggiungi Utente');
    addBtn.setAttribute('icon', 'add');
    const filterBtn = document.createElement('bim-button');
    filterBtn.setAttribute('label', 'Filtra');
    filterBtn.setAttribute('icon', 'filter_list');
    sidebar.appendChild(addBtn);
    sidebar.appendChild(filterBtn);

    // Footer dinamico con copyright
    const footer = document.createElement('div');
    footer.className = 'users-page-footer-inner';
    
    const footerContent = document.createElement('div');
    footerContent.style.display = 'flex';
    footerContent.style.justifyContent = 'center';
    
    const copyrightLabel = document.createElement('bim-label') as any;
    copyrightLabel.textContent = 'Copyright of That Construction Company';
    
    footerContent.appendChild(copyrightLabel);
    footer.appendChild(footerContent);

    // Inserisci gli elementi nei rispettivi container
    const headerContainer = document.getElementById('usersHeader');
    if (headerContainer) {
      headerContainer.innerHTML = '';
      headerContainer.appendChild(header);
    }
    const container = document.getElementById('usersContainer');
    if (container) {
      container.innerHTML = '';
      container.appendChild(usersTable);
    }
    const sidebarContainer = document.getElementById('usersSidebar');
    if (sidebarContainer) {
      sidebarContainer.innerHTML = '';
      sidebarContainer.appendChild(sidebar);
    }
    const footerContainer = document.getElementById('usersFooter');
    if (footerContainer) {
      footerContainer.innerHTML = '';
      footerContainer.appendChild(footer);
    }
  }, []);

  return (
    <Layout sidebar={sidebarComponent}>
      <div className="users-page-content">
        <div className="users-page-main">
          <div id="usersHeader" className="users-page-header" />
          <div id="usersContainer" className="users-table-container" />
          <div id="usersFooter" className="users-page-footer" />
        </div>
        <div id="usersSidebar" className="users-page-sidebar" />
      </div>
    </Layout>
  );
}
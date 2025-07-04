// Demo data for people
let people = [
  {
    id: 1,
    name: "John",
    surname: "Smith",
    email: "john.smith@company.com",
    role: "architect",
    department: "architecture",
    phone: "+1 123 456 7890",
    hireDate: "2022-01-15"
  },
  {
    id: 2,
    name: "Sarah",
    surname: "Johnson",
    email: "sarah.johnson@company.com",
    role: "engineer",
    department: "engineering",
    phone: "+1 234 567 8901",
    hireDate: "2023-03-22"
  },
  {
    id: 3,
    name: "Michael",
    surname: "Davis",
    email: "michael.davis@company.com",
    role: "project-manager",
    department: "project-management",
    phone: "+1 345 678 9012",
    hireDate: "2021-07-10"
  },
  {
    id: 4,
    name: "Emily",
    surname: "Wilson",
    email: "emily.wilson@company.com",
    role: "developer",
    department: "development",
    phone: "+1 456 789 0123",
    hireDate: "2023-09-05"
  },
  {
    id: 5,
    name: "David",
    surname: "Brown",
    email: "david.brown@company.com",
    role: "designer",
    department: "architecture",
    phone: "+1 567 890 1234",
    hireDate: "2022-11-18"
  },
  {
    id: 6,
    name: "Lisa",
    surname: "Taylor",
    email: "lisa.taylor@company.com",
    role: "analyst",
    department: "administration",
    phone: "+1 678 901 2345",
    hireDate: "2023-08-12"
  }
];

let filteredPeople = [...people];
let currentFilter = 'all';

// DOM Elements
const modal = document.getElementById('new-person-modal');
const addPersonBtn = document.getElementById('add-person-btn');
const cancelBtn = document.getElementById('cancel-btn');
const personForm = document.getElementById('person-form');
const searchInput = document.getElementById('search-input');
const peopleList = document.getElementById('people-list');
const filterTabs = document.querySelectorAll('.filter-tab');

// Statistics DOM
const totalPeopleEl = document.getElementById('total-people');
const totalDepartmentsEl = document.getElementById('total-departments');
const newHiresEl = document.getElementById('new-hires');

// Initialization
document.addEventListener('DOMContentLoaded', function() {
  renderPeople();
  updateStats();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  addPersonBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  personForm.addEventListener('submit', handleFormSubmit);
  searchInput.addEventListener('input', handleSearch);
  
  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => handleFilter(tab.dataset.filter));
  });

  // Modal click outside to close
  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closeModal();
    }
  });
}

// Modal functions
function openModal() {
  modal.showModal();
}

function closeModal() {
  modal.close();
  personForm.reset();
}

// Form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(personForm);
  const newPerson = {
    id: Date.now(), // Temporary id
    name: formData.get('person-name'),
    surname: formData.get('person-surname'),
    email: formData.get('person-email'),
    role: formData.get('person-role'),
    department: formData.get('person-department'),
    phone: formData.get('person-phone'),
    hireDate: formData.get('hire-date')
  };

  people.push(newPerson);
  applyFiltersAndSearch();
  updateStats();
  closeModal();
  
  console.log('New person added:', newPerson);
}

// Search functionality
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  applyFiltersAndSearch(searchTerm);
}

// Filter functionality
function handleFilter(filter) {
  currentFilter = filter;
  
  // Update active tab
  filterTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  
  applyFiltersAndSearch();
}

// Apply filters and search
function applyFiltersAndSearch(searchTerm = '') {
  filteredPeople = people.filter(person => {
    // Filter by role
    const matchesFilter = currentFilter === 'all' || person.role === currentFilter;
    
    // Filter by search term
    const fullName = `${person.name} ${person.surname}`.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      fullName.includes(searchTerm) ||
      person.email.toLowerCase().includes(searchTerm) ||
      person.role.toLowerCase().includes(searchTerm) ||
      person.department.toLowerCase().includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });
  
  renderPeople();
}

// Render people list
function renderPeople() {
  if (filteredPeople.length === 0) {
    renderEmptyState();
    return;
  }

  const peopleHTML = filteredPeople.map(person => {
    const initials = `${person.name.charAt(0)}${person.surname.charAt(0)}`;
    const formattedDate = formatDate(person.hireDate);
    
    return `
      <div class="person-row">
        <div class="person-name">
          <div class="person-avatar">${initials}</div>
          <div class="person-info">
            <h4>${person.name} ${person.surname}</h4>
            <p>${person.phone || 'No phone'}</p>
          </div>
        </div>
        <div class="person-email">${person.email}</div>
        <div class="person-role">${getRoleDisplayName(person.role)}</div>
        <div class="person-department">${getDepartmentDisplayName(person.department)}</div>
        <div class="person-date">${formattedDate}</div>
        <div class="person-actions">
          <button class="btn-icon edit" onclick="editPerson(${person.id})" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn-icon delete" onclick="deletePerson(${person.id})" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  peopleList.innerHTML = peopleHTML;
}

// Render empty state
function renderEmptyState() {
  peopleList.innerHTML = `
    <div class="empty-state">
      <span class="material-symbols-outlined">people_outline</span>
      <h3>No people found</h3>
      <p>Try modifying the search filters or add a new person.</p>
    </div>
  `;
}

// Update statistics
function updateStats() {
  const totalPeople = people.length;
  const departments = new Set(people.map(p => p.department));
  const totalDepartments = departments.size;
  
    // Calculate new hires in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newHires = people.filter(person => {
    const hireDate = new Date(person.hireDate);
    return hireDate >= thirtyDaysAgo;
  }).length;

  totalPeopleEl.textContent = totalPeople;
  totalDepartmentsEl.textContent = totalDepartments;
  newHiresEl.textContent = newHires;
}

// Delete person
function deletePerson(id) {
  if (confirm('Are you sure you want to delete this person?')) {
    people = people.filter(person => person.id !== id);
    applyFiltersAndSearch();
    updateStats();
    console.log(`Person with ID ${id} deleted`);
  }
}

// Edit person (placeholder)
function editPerson(id) {
  const person = people.find(p => p.id === id);
  if (person) {
    alert(`Edit functionality for ${person.name} ${person.surname} not yet implemented`);
    console.log('Edit person:', person);
  }
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getRoleDisplayName(role) {
  const roleNames = {
    'architect': 'Architect',
    'engineer': 'Engineer',
    'designer': 'Designer',
    'project-manager': 'Project Manager',
    'developer': 'Developer',
    'analyst': 'Analyst'
  };
  return roleNames[role] || role;
}

function getDepartmentDisplayName(department) {
  const departmentNames = {
    'architecture': 'Architecture',
    'engineering': 'Engineering',
    'development': 'Development',
    'project-management': 'Project Management',
    'administration': 'Administration'
  };
  return departmentNames[department] || department;
}

// Export functions for global access
window.deletePerson = deletePerson;
window.editPerson = editPerson;

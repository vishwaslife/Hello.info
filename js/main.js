// Blog Posts Data (Global)
window.blogPosts = [
  {
    id: 1,
    title: "Clear & Glowing Skin ke liye Daily Routine",
    excerpt: "Aaj ke time me pollution aur stress ki wajah se skin problems common ho gayi hain. Agar aap chahte ho ki aapki skin healthy aur glowing dikhe...",
    category: "skincare",
    date: "2024-01-15",
    emoji: "🧴"
  },
  {
    id: 2,
    title: "Healthy Lifestyle Tips - Simple aur Effective",
    excerpt: "Health sabse important hai. Kuch simple tips follow karke aap apni health ko improve kar sakte ho. Daily exercise, proper sleep...",
    category: "health",
    date: "2024-01-14",
    emoji: "💊"
  },
  {
    id: 3,
    title: "College Life me Time Management kaise kare",
    excerpt: "College me time management bahut zaroori hai. Classes, assignments, exams - sab kuch manage karna padta hai. Yahan kuch tips hain...",
    category: "student",
    date: "2024-01-13",
    emoji: "🎓"
  },
  {
    id: 4,
    title: "Job Interview me Success ke liye Tips",
    excerpt: "Job interview me confidence aur preparation key hai. Resume banane se lekar interview dene tak, sab kuch important hai...",
    category: "career",
    date: "2024-01-12",
    emoji: "💼"
  },
  {
    id: 5,
    title: "Latest Technology Trends 2024",
    excerpt: "Technology har din badal rahi hai. AI, Machine Learning, aur naye apps se lekar latest gadgets tak, sab kuch explore karo...",
    category: "tech",
    date: "2024-01-11",
    emoji: "💻"
  },
  {
    id: 6,
    title: "Paisa Bachane ke Smart Ways",
    excerpt: "Paisa bachana ek art hai. Budget banane se lekar investment tak, kuch smart tips jo aapko financially stable banayengi...",
    category: "money",
    date: "2024-01-10",
    emoji: "💰"
  },
  {
    id: 7,
    title: "Self Improvement - Apne Aap ko Better Banana",
    excerpt: "Har din kuch naya seekhna, apne goals ko achieve karna, aur positive mindset rakhna - ye sab self improvement ka hissa hai...",
    category: "self-improvement",
    date: "2024-01-09",
    emoji: "🧠"
  },
  {
    id: 8,
    title: "Interesting Facts - General Knowledge",
    excerpt: "Duniya me kitne interesting facts hain jo aapko pata nahi honge. Science se lekar history tak, kuch amazing information...",
    category: "general",
    date: "2024-01-08",
    emoji: "📖"
  },
  {
    id: 9,
    title: "Acne Prevention - Simple Home Remedies",
    excerpt: "Acne se pareshan ho? Kuch simple home remedies jo aapko clear skin dene me help karengi. Natural ingredients use karke...",
    category: "skincare",
    date: "2024-01-07",
    emoji: "🧴"
  },
  {
    id: 10,
    title: "Morning Routine for Better Health",
    excerpt: "Subah ki routine aapki puri din ki health affect karti hai. Ek healthy morning routine follow karke aap apni life improve kar sakte ho...",
    category: "health",
    date: "2024-01-06",
    emoji: "💊"
  },
  {
    id: 11,
    title: "Part-time Jobs for Students",
    excerpt: "College students ke liye part-time jobs ek great way hai paisa kamane ka. Online aur offline dono options explore karo...",
    category: "student",
    date: "2024-01-05",
    emoji: "🎓"
  },
  {
    id: 12,
    title: "Resume Writing Tips - Perfect CV Banana",
    excerpt: "Resume aapki first impression hai. Ek perfect resume kaise banaye, kya include kare, aur kya avoid kare - sab kuch yahan hai...",
    category: "career",
    date: "2024-01-04",
    emoji: "💼"
  }
];

// Make blogPosts accessible globally
const blogPosts = window.blogPosts;

// DOM Elements
const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const topBtn = document.getElementById('topBtn');
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');

// Current filter state
let currentFilter = 'all';
let filteredPosts = [...blogPosts];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderPosts(blogPosts);
  setupEventListeners();
  checkTheme();
  setupScrollEffects();
  setupIntersectionObserver();
  
  // Add page load animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in';
    document.body.style.opacity = '1';
  }, 100);
});

// Setup Event Listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener('input', handleSearch);
  
  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => handleFilter(btn.dataset.category));
  });
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Back to top button
  topBtn.addEventListener('click', scrollToTop);
  
  // Card click handlers (will be added dynamically)
}

// Render Posts
function renderPosts(posts) {
  if (posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty-state">
        <h3>No posts found</h3>
        <p>Try a different search or filter</p>
      </div>
    `;
    return;
  }
  
  postsContainer.innerHTML = posts.map(post => `
    <div class="card reveal" onclick="openPost(${post.id})">
      <h3>${post.emoji} ${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="meta">
        <span class="tag">${getCategoryName(post.category)}</span>
        <span class="date">${formatDate(post.date)}</span>
      </div>
    </div>
  `).join('');
  
  // Trigger reveal animation
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 100);
    });
  }, 100);
}

// Handle Search
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  applyFilters(searchTerm);
}

// Handle Filter
function handleFilter(category) {
  currentFilter = category;
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  
  // Clear search
  searchInput.value = '';
  applyFilters('');
}

// Apply Filters
function applyFilters(searchTerm) {
  filteredPosts = blogPosts.filter(post => {
    const matchesCategory = currentFilter === 'all' || post.category === currentFilter;
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  
  renderPosts(filteredPosts);
}

// Get Category Name
function getCategoryName(category) {
  const names = {
    'skincare': '🧴 Skincare',
    'health': '💊 Health',
    'student': '🎓 Student Life',
    'career': '💼 Career',
    'tech': '💻 Technology',
    'money': '💰 Money',
    'self-improvement': '🧠 Self Improvement',
    'general': '📖 General Knowledge'
  };
  return names[category] || category;
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Open Post - Navigate to reading page
function openPost(id) {
  window.location.href = `post.html?id=${id}`;
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// Check Saved Theme
function checkTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
}

// Scroll Effects
function setupScrollEffects() {
  window.addEventListener('scroll', () => {
    // Progress bar
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
    
    // Back to top button
    if (window.scrollY > 300) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
    
    // Animate elements on scroll
    animateOnScroll();
  });
  
  // Initial animation trigger
  animateOnScroll();
}

// Animate elements when they come into view
function animateOnScroll() {
  const elements = document.querySelectorAll('.card, .reveal, .fade-in-up');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('active', 'visible');
    }
  });
}

// Intersection Observer for better performance
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animatable elements
  document.querySelectorAll('.card, .reveal, .fade-in-up').forEach(el => {
    observer.observe(el);
  });
}

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show Toast Notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Make openPost available globally
window.openPost = openPost;
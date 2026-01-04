// YouTube Trending Videos Configuration
// IMPORTANT: Get your YouTube Data API v3 key from: https://console.cloud.google.com/
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE'; // Replace with your API key
const YOUTUBE_REGION_CODE = 'IN'; // Change to your region (US, IN, GB, etc.)
const MAX_VIDEOS = 25;

// Check if data needs refresh (once per day)
function shouldRefreshVideos() {
  const lastRefresh = localStorage.getItem('youtube_last_refresh');
  if (!lastRefresh) return true;
  
  const lastDate = new Date(lastRefresh);
  const today = new Date();
  const diffTime = today - lastDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays >= 1;
}

// Get cached videos
function getCachedVideos() {
  const cached = localStorage.getItem('youtube_videos');
  const cachedDate = localStorage.getItem('youtube_last_refresh');
  
  if (cached && cachedDate) {
    return {
      videos: JSON.parse(cached),
      date: cachedDate
    };
  }
  return null;
}

// Save videos to cache
function cacheVideos(videos) {
  localStorage.setItem('youtube_videos', JSON.stringify(videos));
  localStorage.setItem('youtube_last_refresh', new Date().toISOString());
  updateLastUpdatedDisplay();
}

// Update last updated display
function updateLastUpdatedDisplay() {
  const lastUpdated = document.getElementById('lastUpdated');
  const cachedDate = localStorage.getItem('youtube_last_refresh');
  
  if (cachedDate && lastUpdated) {
    const date = new Date(cachedDate);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 1) {
      lastUpdated.textContent = `Updated ${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      lastUpdated.textContent = `Updated ${diffHours} hours ago`;
    } else {
      lastUpdated.textContent = `Updated ${date.toLocaleDateString()}`;
    }
  }
}

// Fetch YouTube Trending Videos
async function fetchYouTubeTrending() {
  const container = document.getElementById('youtubeContainer');
  const loading = document.getElementById('youtubeLoading');
  
  // Check if API key is set
  if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    container.innerHTML = `
      <div class="error-state">
        <h3>⚠️ YouTube API Key Required</h3>
        <p>To display trending videos, you need to:</p>
        <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
          <li>Get a YouTube Data API v3 key from <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
          <li>Replace 'YOUR_YOUTUBE_API_KEY_HERE' in js/youtube.js with your API key</li>
          <li>Enable YouTube Data API v3 in your Google Cloud project</li>
        </ol>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
          For now, showing sample videos below:
        </p>
      </div>
    `;
    showSampleVideos();
    return;
  }
  
  try {
    loading.style.display = 'flex';
    
    // Fetch trending videos
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${YOUTUBE_REGION_CODE}&maxResults=${MAX_VIDEOS}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      displayVideos(data.items);
      cacheVideos(data.items);
    } else {
      throw new Error('No videos found');
    }
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    container.innerHTML = `
      <div class="error-state">
        <h3>⚠️ Unable to Load Videos</h3>
        <p>${error.message}</p>
        <button onclick="loadYouTubeVideos()" class="refresh-btn" style="margin-top: 15px;">Try Again</button>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.7;">
          Showing sample videos:
        </p>
      </div>
    `;
    showSampleVideos();
  } finally {
    loading.style.display = 'none';
  }
}

// Display videos
function displayVideos(videos) {
  const container = document.getElementById('youtubeContainer');
  
  container.innerHTML = videos.map((video, index) => {
    const snippet = video.snippet;
    const stats = video.statistics || {};
    const thumbnails = snippet.thumbnails;
    const thumbnail = thumbnails.medium || thumbnails.default;
    const videoId = video.id;
    const viewCount = formatNumber(stats.viewCount || 0);
    const likeCount = formatNumber(stats.likeCount || 0);
    const publishedAt = formatDate(snippet.publishedAt);
    
    return `
      <div class="youtube-card reveal" onclick="openYouTubeVideo('${videoId}')">
        <div class="youtube-rank">#${index + 1}</div>
        <div class="youtube-thumbnail">
          <img src="${thumbnail.url}" alt="${snippet.title}" loading="lazy">
          <div class="play-overlay">▶</div>
          <div class="duration-badge">${formatDuration(video.contentDetails?.duration || 'PT0S')}</div>
        </div>
        <div class="youtube-info">
          <h3 class="youtube-title">${snippet.title}</h3>
          <p class="youtube-channel">${snippet.channelTitle}</p>
          <div class="youtube-stats">
            <span>👁️ ${viewCount} views</span>
            <span>👍 ${likeCount}</span>
            <span>📅 ${publishedAt}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Trigger animations
  setTimeout(() => {
    document.querySelectorAll('.youtube-card.reveal').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 50);
    });
  }, 100);
}

// Show sample videos (fallback)
function showSampleVideos() {
  const sampleVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Sample Trending Video 1',
      channel: 'Sample Channel',
      views: '1M',
      likes: '50K',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'Sample Trending Video 2',
      channel: 'Sample Channel',
      views: '500K',
      likes: '25K',
      thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg'
    }
  ];
  
  const container = document.getElementById('youtubeContainer');
  const existingHTML = container.innerHTML;
  
  container.innerHTML += sampleVideos.map((video, index) => `
    <div class="youtube-card reveal" onclick="openYouTubeVideo('${video.id}')">
      <div class="youtube-rank">#${index + 1}</div>
      <div class="youtube-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
        <div class="play-overlay">▶</div>
      </div>
      <div class="youtube-info">
        <h3 class="youtube-title">${video.title}</h3>
        <p class="youtube-channel">${video.channel}</p>
        <div class="youtube-stats">
          <span>👁️ ${video.views} views</span>
          <span>👍 ${video.likes}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Format numbers (1M, 1K, etc.)
function formatNumber(num) {
  const number = parseInt(num);
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

// Format duration (PT4M13S -> 4:13)
function formatDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

// Open YouTube video
function openYouTubeVideo(videoId) {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// Load YouTube videos
function loadYouTubeVideos() {
  const cached = getCachedVideos();
  
  if (cached && !shouldRefreshVideos()) {
    // Use cached data
    displayVideos(cached.videos);
    updateLastUpdatedDisplay();
  } else {
    // Fetch new data
    fetchYouTubeTrending();
  }
}

// Refresh videos manually
function refreshYouTubeVideos() {
  localStorage.removeItem('youtube_videos');
  localStorage.removeItem('youtube_last_refresh');
  fetchYouTubeTrending();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refreshYoutube');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshYouTubeVideos);
  }
  
  loadYouTubeVideos();
  
  // Auto-refresh check on page load
  if (shouldRefreshVideos()) {
    fetchYouTubeTrending();
  }
});

// Make functions globally available
window.openYouTubeVideo = openYouTubeVideo;
window.loadYouTubeVideos = loadYouTubeVideos;
window.refreshYouTubeVideos = refreshYouTubeVideos;

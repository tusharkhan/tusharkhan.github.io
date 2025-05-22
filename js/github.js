let githubToken = 'dsds'
let githubUsername = 'tusharkhan'
const defaultUsername = 'tusharkhan'

let squares = document.querySelector('.squares')
let userUrl = ''
let userLogin = ''
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

document.addEventListener('DOMContentLoaded', function () {
  // Create a new container for GitHub profile and contributions
  const githubSection = document.createElement('div')
  githubSection.id = 'github-profile-section'
  githubSection.className = 'mt-8 mb-6'

  // Find the about section to add our GitHub profile section
  const aboutSection = document.querySelector('#about .about-text')

  // Find the existing GitHub contributions section to replace it
  const existingGithubContributions = document.querySelector('.github-contributions')

  if (aboutSection && existingGithubContributions) {
    // Replace the existing GitHub contributions with our new section
    existingGithubContributions.parentNode.replaceChild(githubSection, existingGithubContributions)

    // Create heading for the GitHub section
    const heading = document.createElement('div')
    heading.className = 'flex justify-between items-center mb-4'
    heading.innerHTML = `
      <h4 class="text-lg font-semibold">My GitHub Profile</h4>
      <div class="github-year-filter flex items-center">
        <span class="mr-2 text-sm">Year:</span>
        <select id="github-year-filter" class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
          <!-- Years will be populated by JavaScript -->
        </select>
      </div>
    `
    githubSection.appendChild(heading)

    // Create user info div
    const userInfoDiv = document.createElement('div')
    userInfoDiv.id = 'user-info'
    userInfoDiv.className = 'mb-4 bg-white rounded-md shadow-sm p-4'
    githubSection.appendChild(userInfoDiv)

    // Create contribution graph container
    const githubContributionGraph = document.createElement('div')
    githubContributionGraph.id = 'github-contribution-graph'
    githubContributionGraph.className = 'bg-white rounded-md shadow-sm p-4'
    githubSection.appendChild(githubContributionGraph)

    // Create a container for the squares visualization
    squares = document.createElement('ul')
    squares.className = 'squares'
    squares.style.display = 'flex'
    squares.style.flexWrap = 'wrap'
    squares.style.listStyle = 'none'
    squares.style.padding = '0'
    squares.style.margin = '0'
    squares.style.maxHeight = '150px'
    squares.style.overflowY = 'auto'
    githubContributionGraph.appendChild(squares)

    // Create a container for user contribution info
    const userContDiv = document.createElement('div')
    userContDiv.id = 'user-contribution'
    userContDiv.className = 'text-center text-sm text-gray-500 mt-4'
    githubContributionGraph.appendChild(userContDiv)

    // Populate the year dropdown
    const yearFilter = document.getElementById('github-year-filter')
    if (yearFilter) {
      const currentYear = new Date().getFullYear()
      const startYear = 2017 // You can adjust this as needed
      for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option')
        option.value = year
        option.textContent = year
        yearFilter.appendChild(option)
      }

      // Handle year selection change
      yearFilter.addEventListener('change', function () {
        const username = githubUsername
        squares.innerHTML = ''
        getUserData(username)
        getGitHubContributions(username, this.value)
      })

      // Automatically load data for the default GitHub user when the page loads
      getUserData(defaultUsername)
      getGitHubContributions(defaultUsername, currentYear)
    }
  }

  async function getUserData(username) {
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => {
          datesegments = data.created_at.split('T').shift().split('-')
          userUrl = data.html_url
          userLogin = data.login
          console.log(data)
          userInfoDiv.innerHTML = `
            <div class="profile-header flex items-center mb-4">
              <img id="avatar" src="${data.avatar_url}" alt="${data.name}" class="w-16 h-16 rounded-full mr-4">
              <div class="profile-info-wrapper">
                <div class="profile-name">
                  <h2 id="name" class="text-xl font-bold">${data.name || data.login}</h2>
                  <a href="${data.html_url}" target="_blank" rel="noopener noreferrer" id="user" class="text-blue-600 hover:underline">@${data.login}</a>
                </div>
                <p id="date" class="text-sm text-gray-500">Joined ${datesegments[2]} ${months[parseInt(datesegments[1]) - 1]} ${datesegments[0]}</p>
              </div>
            </div>
            ${data.bio ? `<p id="bio" class="mb-4">${data.bio}</p>` : ''}
            <div class="profile-stats-wrapper grid grid-cols-3 gap-4 bg-gray-100 rounded-md p-4 mb-4">
              <div class="profile-stat text-center">
                <p class="stat-title text-sm text-gray-500">Repos</p>
                <p id="repos" class="stat-value font-bold">${data.public_repos}</p>
              </div>
              <div class="profile-stat text-center">
                <p class="stat-title text-sm text-gray-500">Followers</p>
                <p id="followers" class="stat-value font-bold">${data.followers}</p>
              </div>
              <div class="profile-stat text-center">
                <p class="stat-title text-sm text-gray-500">Following</p>
                <p id="following" class="stat-value font-bold">${data.following}</p>
              </div>
            </div>
            <div class="profile-bottom-wrapper grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
              ${data.location ? `
                <div class="profile-info flex items-center">
                  <div class="bottom-icons opacity-50 mr-2"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/marker.png" alt="marker"/></div>
                  <p id="location" class="opacity-50">${data.location}</p>
                </div>
              ` : ''}
              ${data.blog ? `
                <div class="profile-info flex items-center">
                  <div class="bottom-icons opacity-50 mr-2"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/link--v1.png" alt="link--v1"/></div>
                  <a href="${data.blog}" id="page" class="opacity-50 hover:opacity-100">${data.blog}</a>
                </div>
              ` : ''}
              ${data.twitter_username ? `
                <div class="profile-info flex items-center">
                  <div class="bottom-icons mr-2"><img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/twitter.png" alt="twitter"/></div>
                  <a href="https://twitter.com/${data.twitter_username}" id="twitter" class="hover:underline">${data.twitter_username}</a>
                </div>
              ` : ''}
              ${data.company ? `
                <div class="profile-info flex items-center">
                  <div class="bottom-icons opacity-50 mr-2"><img width="20" height="20" src="https://img.icons8.com/pastel-glyph/64/FFFFFF/company--v1.png" alt="company--v1"/></div>
                  <p id="company" class="opacity-50">${data.company}</p>
                </div>
              ` : ''}
            </div>
          `
        })
        .catch((error) => {
          userInfoDiv.innerHTML = `<p class="text-red-500">Error: User not found</p>`
        })
    }
  }

  // Handle year selection change
  if (contributionYearSelect) {
    contributionYearSelect.addEventListener('change', function () {
      const username = githubUsername
      squares.innerHTML = ''
      getUserData(username)
      getGitHubContributions(username, this.value)
    })
  }

  // Automatically load data for the default GitHub user when the page loads
  getUserData(defaultUsername)
  getGitHubContributions(defaultUsername, new Date().getFullYear())
})

async function getGitHubContributions(username, year) {
  try {
    // Show loading state if available
    const loadingSpinner = document.querySelector('.loading-spinner')
    const loadingOverlay = document.querySelector('.loading-overlay')
    if (loadingSpinner && loadingOverlay) {
      loadingSpinner.style.display = 'block'
      loadingOverlay.style.display = 'block'
    }

    // For demonstration purposes, we'll use a mock JSON response
    // In a real implementation, you would fetch from GitHub API
    const mockData = {
      contributions: [],
      years: [{ year: year, total: 0 }]
    }

    // Generate some mock contribution data
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const count = Math.floor(Math.random() * 5) // Random contribution count 0-4
      let color = '#ebedf0' // Default color for 0 contributions

      if (count === 1) color = '#c0c0c0' // Light gray for 1 contribution
      else if (count === 2) color = '#808080' // Medium gray for 2 contributions
      else if (count === 3) color = '#333333' // Dark gray for 3 contributions
      else if (count >= 4) color = '#1a1a1a' // Matte black for 4+ contributions

      mockData.contributions.push({
        date: new Date(d).toISOString().split('T')[0],
        count: count,
        color: color
      })

      // Add to total count
      mockData.years[0].total += count
    }

    const userContDiv = document.getElementById('user-contribution')
    const squares = document.querySelector('.squares')

    if (squares) {
      // Clear existing squares
      squares.innerHTML = ''

      // Add new squares for each contribution
      mockData.contributions.forEach((contribution) => {
        const square = document.createElement('li')
        square.dataset.level = contribution.count
        square.style.backgroundColor = contribution.color
        square.style.width = '10px'
        square.style.height = '10px'
        square.style.margin = '1px'
        square.title = `${contribution.date}: ${contribution.count} contributions`
        squares.appendChild(square)
      })
    }

    if (userContDiv) {
      userContDiv.innerHTML = `
        <span>${mockData.years[0].total} contributions in ${year}</span>
        <a href="https://github.com/${username}" id="user-href" target="_blank" class="text-blue-600 hover:underline ml-2">@${username}</a>
      `
    }

    // Hide loading state if available
    if (loadingSpinner && loadingOverlay) {
      loadingSpinner.style.display = 'none'
      loadingOverlay.style.display = 'none'
    }
  } catch (error) {
    console.error('Error loading contribution data:', error)

    // Hide loading state if available
    const loadingSpinner = document.querySelector('.loading-spinner')
    const loadingOverlay = document.querySelector('.loading-overlay')
    if (loadingSpinner && loadingOverlay) {
      loadingSpinner.style.display = 'none'
      loadingOverlay.style.display = 'none'
    }
  }
}

// JavaScript code to scroll the container to the right on page load
window.addEventListener('load', function () {
  const container = document.querySelector('.squares')
  if (container) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Adding 1 because getMonth() returns a zero-based index

    // Define the scroll percentage for each month
    const scrollPositions = {
      1: 0, // January
      2: 0, // February
      3: 0, // March
      4: 0, // April
      5: 0, // May
      6: 30, // June
      7: 30, // July
      8: 40, // August
      9: 40, // September
      10: 40, // October
      11: 45, // November
      12: 100, // December
    }

    const scrollPercentage = scrollPositions[currentMonth]

    if (scrollPercentage !== undefined) {
      // Scroll to the specified percentage of the container's width
      container.scrollLeft = (container.scrollWidth * scrollPercentage) / 100
    }
  }
})

const API_URL = window.location.origin;

// Show/hide tabs
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'leagues') loadLeagues();
    if (tabName === 'teams') loadLeaguesForDropdown('view-teams-league');
    if (tabName === 'statistics') loadLeaguesForDropdown('view-stats-league');
}

// Show message
function showMessage(message, type = 'success') {
    const msgEl = document.getElementById('message');
    msgEl.textContent = message;
    msgEl.className = `message ${type}`;
    msgEl.style.display = 'block';
    
    setTimeout(() => {
        msgEl.style.display = 'none';
    }, 3000);
}

// Create League
document.getElementById('create-league-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        league_id: parseInt(document.getElementById('league-id').value),
        name: document.getElementById('league-name').value,
        country: document.getElementById('league-country').value
    };
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            e.target.reset();
            loadLeagues();
        } else {
            showMessage(result.detail, 'error');
        }
    } catch (error) {
        showMessage('Error creating league', 'error');
    }
});

// Load Leagues
async function loadLeagues() {
    try {
        const response = await fetch(`${API_URL}/api/leagues/`);
        const leagues = await response.json();
        
        const container = document.getElementById('leagues-list');
        
        if (leagues.length === 0) {
            container.innerHTML = '<p style="color: #666;">No leagues found. Create one to get started!</p>';
            return;
        }
        
        container.innerHTML = leagues.map(league => `
            <div class="card">
                <h3>${league.name}</h3>
                <p><strong>ID:</strong> ${league.league_id}</p>
                <p><strong>Country:</strong> ${league.country}</p>
                <p><strong>Teams:</strong> ${league.teams}</p>
                <div class="card-actions">
                    <button class="btn btn-info" onclick="viewLeagueDetails(${league.league_id})">View Details</button>
                    <button class="btn btn-danger" onclick="deleteLeague(${league.league_id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Error loading leagues', 'error');
    }
}

// View League Details
async function viewLeagueDetails(leagueId) {
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}`);
        const league = await response.json();
        
        let detailsHTML = `
            <h3>${league.name}</h3>
            <p><strong>Country:</strong> ${league.country}</p>
            <p><strong>Total Teams:</strong> ${league.teams}</p>
        `;
        
        if (league.teams_list && league.teams_list.length > 0) {
            detailsHTML += '<h4>Teams:</h4><ul>';
            league.teams_list.forEach(team => {
                detailsHTML += `<li>${team.name} (Manager: ${team.manager})</li>`;
            });
            detailsHTML += '</ul>';
        }
        
        if (Object.keys(league.statistics).length > 0) {
            detailsHTML += '<h4>Statistics:</h4>';
            for (const [statId, statData] of Object.entries(league.statistics)) {
                detailsHTML += `<p>Stat ${statId}: ${JSON.stringify(statData)}</p>`;
            }
        }
        
        alert(detailsHTML.replace(/<[^>]*>/g, '\n'));
    } catch (error) {
        showMessage('Error loading league details', 'error');
    }
}

// Delete League
async function deleteLeague(leagueId) {
    if (!confirm('Are you sure you want to delete this league?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            loadLeagues();
        } else {
            showMessage(result.detail, 'error');
        }
    } catch (error) {
        showMessage('Error deleting league', 'error');
    }
}

// Add Team
document.getElementById('add-team-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const leagueId = parseInt(document.getElementById('team-league-id').value);
    const data = {
        team_id: parseInt(document.getElementById('team-id').value),
        team_name: document.getElementById('team-name').value,
        manager: document.getElementById('team-manager').value
    };
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}/teams/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            e.target.reset();
        } else {
            showMessage(result.detail, 'error');
        }
    } catch (error) {
        showMessage('Error adding team', 'error');
    }
});

// Load Leagues for Dropdown
async function loadLeaguesForDropdown(selectId) {
    try {
        const response = await fetch(`${API_URL}/api/leagues/`);
        const leagues = await response.json();
        
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select a league...</option>' + 
            leagues.map(league => `<option value="${league.league_id}">${league.name}</option>`).join('');
    } catch (error) {
        showMessage('Error loading leagues', 'error');
    }
}

// Load Teams
async function loadTeams() {
    const leagueId = document.getElementById('view-teams-league').value;
    if (!leagueId) {
        showMessage('Please select a league', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}/teams/`);
        const teams = await response.json();
        
        const container = document.getElementById('teams-list');
        
        if (teams.length === 0) {
            container.innerHTML = '<p style="color: #666;">No teams found in this league.</p>';
            return;
        }
        
        container.innerHTML = teams.map(team => `
            <div class="card">
                <h3>${team.name}</h3>
                <p><strong>Team ID:</strong> ${team.team_id}</p>
                <p><strong>Manager:</strong> ${team.manager}</p>
                <div class="card-actions">
                    <button class="btn btn-danger" onclick="removeTeam(${leagueId}, ${team.team_id})">Remove</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        showMessage('Error loading teams', 'error');
    }
}

// Remove Team
async function removeTeam(leagueId, teamId) {
    if (!confirm('Are you sure you want to remove this team?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}/teams/${teamId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            loadTeams();
        } else {
            showMessage(result.detail, 'error');
        }
    } catch (error) {
        showMessage('Error removing team', 'error');
    }
}

// Update Statistics
document.getElementById('update-stats-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const leagueId = parseInt(document.getElementById('stats-league-id').value);
    const data = {
        stat_id: parseInt(document.getElementById('stat-id').value),
        description: document.getElementById('stat-description').value,
        team_id: parseInt(document.getElementById('stat-team-id').value),
        value: parseInt(document.getElementById('stat-value').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}/statistics/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            e.target.reset();
        } else {
            showMessage(result.detail, 'error');
        }
    } catch (error) {
        showMessage('Error updating statistics', 'error');
    }
});

// Load Statistics
async function loadStatistics() {
    const leagueId = document.getElementById('view-stats-league').value;
    if (!leagueId) {
        showMessage('Please select a league', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/leagues/${leagueId}/statistics/`);
        const stats = await response.json();
        
        const container = document.getElementById('stats-list');
        
        if (Object.keys(stats).length === 0) {
            container.innerHTML = '<p style="color: #666;">No statistics found for this league.</p>';
            return;
        }
        
        let statsHTML = '<div class="stats-container">';
        
        for (const [statId, statInfo] of Object.entries(stats)) {
            statsHTML += `
                <div class="stat-item">
                    <h4>${statInfo.description} (ID: ${statId})</h4>
                    <div class="stat-data">
            `;
            
            for (const [teamId, value] of Object.entries(statInfo.data)) {
                statsHTML += `
                    <div class="stat-data-item">
                        <span>Team ${teamId}:</span>
                        <strong>${value}</strong>
                    </div>
                `;
            }
            
            statsHTML += '</div></div>';
        }
        
        statsHTML += '</div>';
        container.innerHTML = statsHTML;
    } catch (error) {
        showMessage('Error loading statistics', 'error');
    }
}

// Initialize
window.onload = () => {
    loadLeagues();
};
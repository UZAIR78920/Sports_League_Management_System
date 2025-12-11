from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn

# Import your existing league classes
from main import LeagueManager, Team

app = FastAPI(title="League Management System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize LeagueManager
leagues = LeagueManager()

# Pydantic models for request validation
class LeagueCreate(BaseModel):
    league_id: int
    name: str
    country: str

class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None

class TeamCreate(BaseModel):
    team_id: int
    team_name: str
    manager: str

class StatisticUpdate(BaseModel):
    stat_id: int
    description: str
    team_id: int
    value: int

# Root endpoint - serve HTML
@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("templates/index.html", "r") as f:
        return HTMLResponse(content=f.read())

# League endpoints
@app.post("/api/leagues/", response_model=dict)
async def create_league(league: LeagueCreate):
    """Create a new league"""
    if league.league_id in leagues.leagues:
        raise HTTPException(status_code=400, detail=f"League ID {league.league_id} already exists")
    
    leagues.create_league(league.league_id, league.name, league.country)
    return {"message": f"League '{league.name}' created successfully", "league_id": league.league_id}

@app.get("/api/leagues/", response_model=List[dict])
async def get_all_leagues():
    """Get all leagues"""
    return [league.get_info() for league in leagues.leagues.values()]

@app.get("/api/leagues/{league_id}", response_model=dict)
async def get_league(league_id: int):
    """Get a specific league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    league = leagues.leagues[league_id]
    info = league.get_info()
    info["teams_list"] = [{"team_id": t.team_id, "name": t.name, "manager": t.manager} for t in league.teams]
    info["statistics"] = {stat_id: stat.get_statistics() for stat_id, stat in league.statistics.items()}
    return info

@app.put("/api/leagues/{league_id}", response_model=dict)
async def update_league(league_id: int, league_update: LeagueUpdate):
    """Update league information"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.update_league(league_id, league_update.name, league_update.country)
    return {"message": "League updated successfully"}

@app.delete("/api/leagues/{league_id}", response_model=dict)
async def delete_league(league_id: int):
    """Delete a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.delete_league(league_id)
    return {"message": f"League ID {league_id} deleted successfully"}

# Team endpoints
@app.post("/api/leagues/{league_id}/teams/", response_model=dict)
async def add_team(league_id: int, team: TeamCreate):
    """Add a team to a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.manage_league_teams(league_id, team.team_id, 'add', team.team_name, team.manager)
    return {"message": f"Team '{team.team_name}' added successfully"}

@app.delete("/api/leagues/{league_id}/teams/{team_id}", response_model=dict)
async def remove_team(league_id: int, team_id: int):
    """Remove a team from a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.manage_league_teams(league_id, team_id, 'remove')
    return {"message": f"Team ID {team_id} removed successfully"}

@app.get("/api/leagues/{league_id}/teams/", response_model=List[dict])
async def get_teams(league_id: int):
    """Get all teams in a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    league = leagues.leagues[league_id]
    return [{"team_id": t.team_id, "name": t.name, "manager": t.manager} for t in league.teams]

# Statistics endpoints
@app.post("/api/leagues/{league_id}/statistics/", response_model=dict)
async def create_statistic(league_id: int, stat_id: int, description: str):
    """Create a new statistic tracker for a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.track_league_statistics(league_id, stat_id, description)
    return {"message": "Statistic tracker created successfully"}

@app.put("/api/leagues/{league_id}/statistics/", response_model=dict)
async def update_statistic(league_id: int, stat_update: StatisticUpdate):
    """Update statistics for a team"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    leagues.update_statistics(league_id, stat_update.stat_id, stat_update.team_id, stat_update.value)
    return {"message": "Statistics updated successfully"}

@app.get("/api/leagues/{league_id}/statistics/", response_model=dict)
async def get_statistics(league_id: int):
    """Get all statistics for a league"""
    if league_id not in leagues.leagues:
        raise HTTPException(status_code=404, detail=f"League ID {league_id} not found")
    
    league = leagues.leagues[league_id]
    stats = {}
    for stat_id, stat in league.statistics.items():
        stats[stat_id] = {
            "description": stat.description,
            "data": stat.get_statistics()
        }
    return stats

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)

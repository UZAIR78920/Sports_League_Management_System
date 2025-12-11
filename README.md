# League Management System

A full-stack web application for managing sports leagues, teams, and statistics built with FastAPI backend and vanilla JavaScript frontend.

## Features

- ⚽ **League Management**: Create, view, update, and delete leagues
- 👥 **Team Management**: Add and remove teams from leagues
- 📊 **Statistics Tracking**: Track and update team statistics
- 🎨 **Modern UI**: Responsive design with smooth animations
- 🚀 **Fast API**: Built with FastAPI for high performance

## Project Structure

```
league-management-system/
├── app.py                  # FastAPI application
├── league_classes.py       # Data models and business logic
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html         # Main HTML page
├── static/
│   ├── style.css          # Stylesheet
│   └── script.js          # Frontend JavaScript
└── README.md
```

## Installation

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd league-management-system
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Mac/Linux:
  ```bash
  source venv/bin/activate
  ```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run the application**
```bash
uvicorn app:app --reload
```
or
```bash
python app.py
```

6. **Open in browser**
Navigate to: `http://localhost:8000`


## API Endpoints

### Leagues
- `POST /api/leagues/` - Create a new league
- `GET /api/leagues/` - Get all leagues
- `GET /api/leagues/{league_id}` - Get specific league details
- `PUT /api/leagues/{league_id}` - Update league
- `DELETE /api/leagues/{league_id}` - Delete league

### Teams
- `POST /api/leagues/{league_id}/teams/` - Add team to league
- `GET /api/leagues/{league_id}/teams/` - Get all teams in league
- `DELETE /api/leagues/{league_id}/teams/{team_id}` - Remove team

### Statistics
- `POST /api/leagues/{league_id}/statistics/` - Create statistic tracker
- `PUT /api/leagues/{league_id}/statistics/` - Update statistics
- `GET /api/leagues/{league_id}/statistics/` - Get all statistics

## Usage Examples

### Create a League
1. Go to the "Leagues" tab
2. Fill in League ID, Name, and Country
3. Click "Create League"

### Add Teams
1. Go to the "Teams" tab
2. Enter League ID, Team ID, Team Name, and Manager
3. Click "Add Team"

### Track Statistics
1. Go to the "Statistics" tab
2. Enter League ID, Stat ID, Description, Team ID, and Value
3. Click "Update Statistics"

## Technologies Used

- **Backend**: FastAPI, Python 3.11+
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Render
- **API**: RESTful API design

## Environment Variables

For production deployment on Render, you can set these environment variables:
- `PORT`: Automatically set by Render
- `PYTHON_VERSION`: 3.11.0 (recommended)

## Troubleshooting

### Port Issues
If you get a port error, ensure Render is using the correct start command:
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Static Files Not Loading
Make sure your directory structure is correct:
```
/static
  - style.css
  - script.js
/templates
  - index.html
```

### CORS Issues
The app includes CORS middleware. If you face CORS issues, check the `allow_origins` setting in `app.py`.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT License

## Author

Your Name

## Support


For issues or questions, please open an issue on GitHub.

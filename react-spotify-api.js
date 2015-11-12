var SpotifySearch = React.createClass(
{	
	timeout : null,
	working : false,
	type    : 'album',
	search  : '',
	limit   : 10,

	getInitialState : function ()
	{
		return {
			results : [],
		}
	},

	doSearch : function ()
	{
		var self = this;

		if (this.timeout !== null)
		{
			clearTimeout(this.timeout);
		}

		if (!this.working && this.state.search != '')
		{
			this.timeout = setTimeout(function ()
			{
				self.working = true;

				$.ajax(
				{
				    url: 'https://api.spotify.com/v1/search',
				    data : 
				    {
						q     : self.search,
						type  : self.type,
						limit : self.limit
				    }

				})
				.done(self.updateResults)
				.always(function ()
				{
					self.working = false;
				});

			}, 200);		
		}
	},

	setType : function (event)
	{	
		this.type = event.target.value;
		this.doSearch();
	},

	setValue : function (event)
	{
		this.search = event.target.value;
		this.doSearch();
	},

	setLimit : function (event)
	{
		this.limit = event.target.value;
		this.doSearch();
	},

	updateResults : function (response)
	{
		var responseTypeKey = Object.keys(response)[0];

		this.setState({results: response[responseTypeKey].items});		
	},

	render : function ()
	{
		return (
			<div>
				<SpotifySearchForm onTypeChange={this.setType} onValueChange={this.setValue} onLimitChange={this.setLimit} />
				<SpotifySearchResults data={this.state.results} type={this.type} />
			</div>
		);
	}
});

var SpotifySearchResults = React.createClass(
{
	render : function ()
	{	
		var results = this.props.data,
			items   = [];

		for (var item in results)
		{	
			switch (this.props.type)
			{
				case 'album' :
					items.push(<SpotifySearchAlbum key={results[item].id} data={results[item]}/>);
				break;

				case 'track' :
					items.push(<SpotifySearchTrack key={results[item].id} data={results[item]}/>);
				break;

				case 'artist' :
					items.push(<SpotifySearchArtist key={results[item].id} data={results[item]}/>);
				break;

				default : 
				break;
			}
		}

		return (
			<div className="row" style={{marginTop: '40px'}}>
				<div className="col-lg-10 col-lg-offset-1">
					{items}
				</div>
			</div>
		);
	}
});

var SpotifySearchForm = React.createClass(
{
	render : function ()
	{
		return (
			<div className="row">
				<div className="col-lg-6 col-lg-offset-3">
					<form>
						<input type="text" className="form-control" value={this.props.value} onChange={this.props.onValueChange} placeholder="Enter a search term..." /><br />
						<div className="row">
							<div className="col-lg-6">
								<div className="form-group">
									<label>Search Type</label>
									<select className="form-control" onChange={this.props.onTypeChange}>
										<option value="album">Album</option>
										<option value="track">Song</option>
										<option value="artist">Artist</option>
									</select>
								</div>
							</div>
							<div className="col-lg-6">			
								<div className="form-group">
									<label>No. Results</label>
									<select className="form-control" onChange={this.props.onLimitChange}>
										<option value="10">10</option>
										<option value="20">20</option>
										<option value="50">50</option>
									</select>
								</div>
							</div>	
						</div>
					</form>
				</div>
			</div>
		);
	}
});

var SpotifySearchAlbum = React.createClass(
{
	render : function ()
	{	
		var album = this.props.data;

		return (
				<div className="panel panel-default">
	  				<div className="panel-body">
						<a href={album.uri}>
							{album.name}
						</a>
					</div>
				</div>		
		);
	}
});

var SpotifySearchTrack = React.createClass(
{
	render : function ()
	{
		var track = this.props.data;

		return (
			<div className="panel panel-default">
  				<div className="panel-body">
					<a href={track.uri}>
						{track.name}
					</a>
				</div>
			</div>			
		);		
	}
});

var SpotifySearchArtist = React.createClass(
{
	render : function ()
	{
		var artist = this.props.data;

		return (
			<div className="panel panel-default">
  				<div className="panel-body">
					<a href={artist.uri}>
						{artist.name}
					</a>
					<p><strong>Populatity: </strong> {artist.popularity}</p>
				</div>
			</div>			
		);		
	}
});

ReactDOM.render
(
	<SpotifySearch />,
	document.getElementById('spotify-search')
);
exports.show = function(req, res){
    var topBand = [
        {
            name: 'Naver',
            description: 'Korea 1st Portal',
            album: 'http://www.naver.com',
            year: '1999'
        }, {
            name: 'Daum',
            description: 'Korea 2nd Portal',
            album: 'http://www.daum.net',
            year: '1998'
        }, {
            name: 'Google',
            description: 'World 1st Portal',
            album: 'http://www.google.com',
            year: '2000'
        }
    ];

    res.render('index', {
        title: 'The best portals',
        callToAction: 'Hello Portal',
        bands: topBand
    });
};
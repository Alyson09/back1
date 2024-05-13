create table partida(
	idPartida varchar (50),
	pPassada char (100),
	pPresente char (100),
	pFutura char (100),
	
	primary key (idPartida)
);


create table time(
	idTime varchar (50),
	nomeTime char(20),
	logoTime char (200),
	idPartida varchar(50),
	
	primary key (idTime),
	foreign key (idPartida) references partida 
);

create table jogador(
	idJogador varchar (50),
	nomeJog char (50),
	numero int, 
	posicao char(20),
	idTime varchar(50),
	
	primary key(idJogador),
	foreign key(idTime) references time
);

create table usuario(
	idUsu varchar(50),
	nomeUsu varchar(20),
	senhaUsu varchar(200),
	emailUsu varchar(20),
	roleUsu varchar(50),
	tokenusu varchar (500),
	
	primary key(idUsu)
);

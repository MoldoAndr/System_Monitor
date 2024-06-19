# System_Monitor
	Monitor de sistem care afiseaza in cadrul unei pagini web informatii 
 	despre sistemul pe care ruleaza programul, putand fi accesat remotely.

	Implementari ulterioare: creare unui utilizator restrictionat care are 
 	ca path un folder local ~/bin in care se gasesc doar comenzile de baza, 
  	fiind astfel realizata in mod secure o linie de comanda cu un set de 
   	comenzi restrictionat de catre dezvoltator.
	
	Crearea unui task Scheduler care permite prin intermediul unei
 	combinatii intre js, php si bash scripting sa automatizeze 
  	procesul de programare de taskuri, momentan putand da ca input 
   	din interfata web comanda ce va fi rulata si data si ora cand 
    se va rula, se creeaza automat un cronjob care se va executa la momentul respectiv.

	Implementarea liniei de comanda va avea loc in cadrul unui 
 	mediu sanitizat, fara a avea legaturi cu exteriorul, in cadrul 
  	unei instante de docker, care va comunica cu serverul propriu 
   	zis prin port-forwarding / printr-un fisier comun.

# Calculating π
An exploration into methods of calculating π

## Monte Carlo
This method uses random probability and geometry to calculate π   

We start with a square $C$ of side length $s$.   
[example 1]  
Within $C$ lets choose a subsection $B$   
Lets also choose $x$ and $y$ from the set $[0,s]$, and have $v = (x,y)$   
Then the probability that $v$ falls in $B$ is as follows:   
$P({v\;in\;B}) = \frac{Area_{B}}{Area_{C}} = \frac{Area_{B}}{s^2}$  
If we choose $B$ to be to the circle inscribed in $C$, the probability that $v$ is in $B$ is $\frac{π}{4}$.  
$P({v\;in\;B}) = \frac{Area_{B}}{s^2} = \frac{\frac{πs^2}{4}}{s^2} = \frac{π}{4}$  
[example 2]  
This means if we choose $n$ random points within $C$, the number of points, $n'$, that fall within $B$ will approximately be $\frac{πn}{4}$.  
With this, we can approximate π:  
$n'\cdot\frac{4}{n}\approxπ$  
You can see this in action below:  

[demo]  

$n=$  
$n'=$  
$π\approx$  


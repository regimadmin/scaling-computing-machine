# Implementing First-Order Rewriting with Constructor Systems - Satish Thatte

> Source: `sources/Implementing First-Order Rewriting with Constructor Systems - Satish Thatte.pdf` | Pages: 10 | Extraction: embedded text layer, with Tesseract OCR fallback for image-only pages.


---

## Page 1

Theoretical Computer Science 61 (1988) 83-92 
North-Holland 
83 
NOTE 
Department of Electrical Engineering and Computer Science, ‘Ile University of Michigan, Ann A&or, 
MI48109, USA. 
Communicated by 
Received September 1987 
Abstract. In previous work [8 J we described a technique for translating a general class of equational 
rewriting systems called reguhr systems [3] to constructor-based systems. This paper extends the 
previous results by showing that the translation technique described in [S] is much more generally 
applicable under a slight restriction of rewriting in the translated version of the system. The three 
additional classes we consider are those of semiregular systems (a generalization of regular 
systems), canonical systems, and arbitrary call-by-varue confluent systems. It is shown that in 
each case the translation preserves the defining characteristics and normal forms of the class. 
1. Intrduction 
Among the many examples of the use of fir 
:*-order 
term-rewriting systems I a 
functional programming [ 1,3,7,11], only a few [ 1,3] use systems that do not require 
argument patterns in function definitions to be built from a special class of constructor 
symbols. The reason for the popularity of constructor-based 
definitions is the 
simplicity and efficiency with which they can be implemented. In [g] we described 
a technique which can “compile” any program in the broadest class (regular systems) 
considered by Hoffmann-O’Donnell [3] to an equivalent constructor-based program. 
The basic idea involved can be seen by examining the following two equations, 
which are a part of an equational LISP interpreter in [2]. 
(1) evalkonsk 
Y 1,~) = apply(evaU, 
Y 1, Y, z), 
(2) apply(eval(car, z), cons(x, y), 21) = car(eval(x, z 
The interesting point is that “eval” is used both as a function in equation (l), 
and as a constructor of data patterns in eq 
tin&on between 
constructors and defined functions appears to have 
tive significance, and increased clarity and economy of ex 
by ignoring it 
03043975/88/$3.X) @ 1988, Elsevier Science Publishers B.V. (North-Hohand)

![page001-img01.png](images/page001-img01.png)
![page001-img03.png](images/page001-img03.png)
![page001-img04.png](images/page001-img04.png)
![page001-img06.png](images/page001-img06.png)
![page001-img07.png](images/page001-img07.png)
![page001-img08.png](images/page001-img08.png)
![page001-img10.png](images/page001-img10.png)
![page001-img11.png](images/page001-img11.png)
![page001-img13.png](images/page001-img13.png)
![page001-img14.png](images/page001-img14.png)
![page001-img15.png](images/page001-img15.png)
![page001-img16.png](images/page001-img16.png)
![page001-img17.png](images/page001-img17.png)
![page001-img18.png](images/page001-img18.png)
![page001-img20.png](images/page001-img20.png)
![page001-img21.png](images/page001-img21.png)
![page001-img22.png](images/page001-img22.png)
![page001-img23.png](images/page001-img23.png)
![page001-img24.png](images/page001-img24.png)
![page001-img25.png](images/page001-img25.png)
![page001-img26.png](images/page001-img26.png)
![page001-img27.png](images/page001-img27.png)
![page001-img28.png](images/page001-img28.png)
![page001-img29.png](images/page001-img29.png)
![page001-img30.png](images/page001-img30.png)
![page001-img31.png](images/page001-img31.png)
![page001-img32.png](images/page001-img32.png)
![page001-img33.png](images/page001-img33.png)
![page001-img34.png](images/page001-img34.png)
![page001-img35.png](images/page001-img35.png)
![page001-img36.png](images/page001-img36.png)
![page001-img37.png](images/page001-img37.png)
![page001-img38.png](images/page001-img38.png)
![page001-img39.png](images/page001-img39.png)
![page001-img40.png](images/page001-img40.png)
![page001-img41.png](images/page001-img41.png)
![page001-img42.png](images/page001-img42.png)
![page001-img49.png](images/page001-img49.png)
![page001-img50.png](images/page001-img50.png)


---

## Page 2

84 
S lhatte 
gains are achieved at the cost of a considerable increase in the complexity of 
implement&m, 
especially in pattern matching since it is not necessarily 
own 
whether an application needs to be evaluated. 
In regular systems, although such dual use of symbols is permitted, the two kinds 
of applications 
are actually separated by the rule that left-hand sides of equations 
must not overlap. It is therefore easy to eliminate dual use by introducing new 
constructor symbols for symbols with dual use, and new equations to detect and 
convert the constructor-like occurrences to the new symbols. The technique can be 
used in the form of a preprocessor to achieve the generality of regular systems with 
a constructor-based implementation, at the cost of an expansion in the total size of 
patterns that is quadratic in the worst case, but relatively small in realistic cases 
such as the LISP interpreter mentioned above. Recent programming systems based 
on term rewriting [l] are beginning to use classes of rewriting systems more general 
than regular systems. It is therefore of interest to investigate how far the translation 
technique can be generalized. 
As the two main lemmas in [8] (restated in Section 2) show, the translated system 
is able to faithfully mimic the behavior of the original system, whether the latter is 
regular or not. The limits on the application of the method lie in other properties 
of the translated system. In the case of regular systems, the translation was shown 
to preserve regularity. Preservation of the defining characteristics of a class of systems 
is clearly a desirable, and often suthcient condition for applicability. We shall 
therefore use it as the primary criterion. Semhgulizr systems are the first and simplest 
new class we consider. For our purposes, the essential aspect of regularity is 
nonoveriappiqg left-hand sides. The other rules defining regularity, such as the 
linearity of left-hand sides, can be viewed as being intended to ensure the Church- 
Rosser property. The class can therefore be broadened to semi-regular systems by 
retaining the nonoverlapping rule, and replacing the others by the property they 
are intended to ensure. In Section 3, we show that the translation preserves the 
property of semiregularity. Canonical (confluent terminating) systems are a widely 
used and well-behaved class that does not guarantee nonoverlapping left-hand sides. 
Jt turns out that although canonicity is not preserved by the translation under 
arbitrary rewriting, it is preserved if rewriting in the translated system respects a 
weak ordering on the new equations. Since the completeness of mimicry mentioned 
above is valid only under arbitrary rewriting, a notion of “sufficiently complete 
mimicry” is needed for this case. We use the obvious one -;quiring that all normal 
forms of the original system can be produced in the new one. These results for 
canonical systems are proved in Section 4. Arbitrary confluent systems constitute 
the most general class one could consider. It is not surprising that in such a general 
setting, none of the results for the previous classes hold. However, in the practically 
important case where the original system follows a call-by-value evaluation strategy, 
the translation does preserve confluence and normal forms under the same weak 
restriction on rewriting used in the case of canonical systems. This is shown in 
Section 5.

![page002-img01.png](images/page002-img01.png)
![page002-img02.png](images/page002-img02.png)
![page002-img03.png](images/page002-img03.png)
![page002-img04.png](images/page002-img04.png)
![page002-img05.png](images/page002-img05.png)
![page002-img06.png](images/page002-img06.png)
![page002-img07.png](images/page002-img07.png)
![page002-img08.png](images/page002-img08.png)
![page002-img09.png](images/page002-img09.png)
![page002-img10.png](images/page002-img10.png)
![page002-img11.png](images/page002-img11.png)
![page002-img12.png](images/page002-img12.png)
![page002-img13.png](images/page002-img13.png)
![page002-img14.png](images/page002-img14.png)
![page002-img15.png](images/page002-img15.png)
![page002-img16.png](images/page002-img16.png)
![page002-img17.png](images/page002-img17.png)
![page002-img18.png](images/page002-img18.png)
![page002-img19.png](images/page002-img19.png)
![page002-img22.png](images/page002-img22.png)
![page002-img23.png](images/page002-img23.png)
![page002-img24.png](images/page002-img24.png)
![page002-img25.png](images/page002-img25.png)
![page002-img26.png](images/page002-img26.png)
![page002-img27.png](images/page002-img27.png)
![page002-img28.png](images/page002-img28.png)
![page002-img29.png](images/page002-img29.png)


---

## Page 3

f ihpuodsauw 
aql ~J!M fi sioqwds Mau 111~ 
%u!xidaJ AIduris Kq Q 
01 738q IQ u! s&al 
swa[oJd 
1~~1 uxs!yd~o~io~roy 
13 s! H 
aJayM ‘[g] 
ut paAoJd am sawruaj %U?MO~~OJ 
agJ, 
woflru~suo3 
am 
Ilaql ‘*a=! 6,~ ui II= ala 4 sloquxk Mau ayi put3 ‘x JoJ paqp3sap 
~CIJM 
ayi uf ,d pu8,3 oiu! pauopy8d aq utf3 ,x ‘(2) Kq asoyi Jail81 aq3 pu8 (I) ICQ 
paltrpuwu salru SU~B~UO~ JaurJoJ aql aJayM ‘:v putr ! a OJU~ ,a uoygx8d llaqs aM 
0,~ 3 c,n b) Uaqi ‘p8ay s31. w 
d tuo~j IoqwrCs e sey a u! ap!s putrq-lJ;la! B JO n twalqns ladodd e JaAauayM (2) 
Ql N’ 
‘,I) Uaw ‘ar w 
‘I) JI (I) 
:suo?2Jassa OMJ %U!MOllOJ aql %ugJs~l8s UralsAs 
JsaIItrurs ay, sl 8 JO ,a uoge~su83~ au l 
p=8idar 
0s sa3uaun330 110 qgm r;wai ayi 
,,a pua ch bq paxtldaJ d B~‘JO 33uaunaao Jauu! haAa ~JIM I mai aqi alouap ,t lg 
l 
{g 3JI42) A g = ,g ia? l 
paww aq MOU ua3 a UraisrCs k18 JO uo~iajsu~~ au 
l 
isaJ ayi 
suguo:, 
3 pups ti ui aln~ 8 ~0 1 apis purey-i,al aruos ~0 paay ay:, 1~ mm0 y3lq~ 
S~oqIU~s asoyi 118 SU!8)UO3 J aJaqM ‘rljaAy3adSa suo!ywnJpaulJap 
pU8 SJ0~3&4lSUO3 
JO fJ put? 3 s3ras OMf aq, 
OJU! 
g 
uoyiu”d 
aM 2 
uIa)sAs uaA@ 8 0) uotl8laJ III 
wuaisrCs aifJMaJ u? a3uiMyyu@s 18nsn +ayi aA8y II!M *t 
aJnsol3 
ahfi!suleJi ang3agaJ sg pu8 c uoy8laJ ag3MaJ au l 
&f 
6~ paiouap aq II~M 0 pu8 d 
Sywd JO uop8ua)w 
aq& l 
&I wa) 
ay, Lq rura)qns 18y1 %up8ldar JO )Insar ayi aiouap 01 
[m =&Jr pu8 2 Aq paymar t jo uuaiqns aqi aiou 
01 d/t asn aa 3ia ‘iuawn%l8 
uo3as ayi jo iuaurnfk8 pif~i ayi say38ar 
,,gz,, 
% 
s ag, ‘Jfasg uual ay, 
sassarpp8 
xwai 8 jo suuaiqns ,,sswpps,, 01 pasn sratlaiui jo %upis Aidurauou 
wwai-x 
jo (J 2) +8d B S_I apu y38a aJaqM %a[ru jo ias 8 L1dru!s sy. 
(r uo pas8q) u uaisits UI)UrnaJ v w3uaun330 
.GWU! aq 0) p?SS aJ8 
Y# ‘ l l l -1 II! 
s~oqwds uoyunj jo Satx&ko 
ay:, a( 371‘ 9 l l ‘1 l)/ 
UUa) 8 UaAlD ‘SaIq8IJ8A h[InU 
apnI3ut X8tu swraJ 3urra~-~ pun033 118 aiouap 111~ Q 
‘)aqarydI8 paqutnr 8 s! g 
j1 -[g-J uUfMj-W%U8q3 II8UIS q)fM-UO~J~OU 
pU8 1c%O~OU~wa] alaOS 1183aJ ,SJy aM

![page003-img02.png](images/page003-img02.png)
![page003-img03.png](images/page003-img03.png)
![page003-img04.png](images/page003-img04.png)
![page003-img05.png](images/page003-img05.png)
![page003-img06.png](images/page003-img06.png)
![page003-img07.png](images/page003-img07.png)
![page003-img08.png](images/page003-img08.png)
![page003-img09.png](images/page003-img09.png)
![page003-img10.png](images/page003-img10.png)
![page003-img11.png](images/page003-img11.png)
![page003-img13.png](images/page003-img13.png)
![page003-img14.png](images/page003-img14.png)
![page003-img15.png](images/page003-img15.png)
![page003-img16.png](images/page003-img16.png)
![page003-img17.png](images/page003-img17.png)
![page003-img18.png](images/page003-img18.png)
![page003-img19.png](images/page003-img19.png)
![page003-img20.png](images/page003-img20.png)
![page003-img21.png](images/page003-img21.png)
![page003-img22.png](images/page003-img22.png)
![page003-img24.png](images/page003-img24.png)
![page003-img25.png](images/page003-img25.png)
![page003-img26.png](images/page003-img26.png)
![page003-img27.png](images/page003-img27.png)
![page003-img28.png](images/page003-img28.png)
![page003-img29.png](images/page003-img29.png)
![page003-img30.png](images/page003-img30.png)
![page003-img31.png](images/page003-img31.png)
![page003-img32.png](images/page003-img32.png)
![page003-img33.png](images/page003-img33.png)
![page003-img35.png](images/page003-img35.png)
![page003-img36.png](images/page003-img36.png)
![page003-img37.png](images/page003-img37.png)
![page003-img38.png](images/page003-img38.png)
![page003-img39.png](images/page003-img39.png)
![page003-img40.png](images/page003-img40.png)
![page003-img41.png](images/page003-img41.png)
![page003-img42.png](images/page003-img42.png)
![page003-img43.png](images/page003-img43.png)
![page003-img47.png](images/page003-img47.png)
![page003-img48.png](images/page003-img48.png)
![page003-img49.png](images/page003-img49.png)
![page003-img50.png](images/page003-img50.png)


---

## Page 4

S 77mtte 
states that whenever t +* u1 and t +* u2 for any term 2, there is a term v such that 
U, +* t) and u2 +* v. This property ensures the uniqueness of no 
Church-Rosser property) and is usually taken to be essential for 
of rewriting. Confluence is not preserved by our translation in general, as in the 
example below. 
System R 
System R; 
Ri 
f(g(x), h(Y))-,0 
f&(x)9 a(x)) + 0 
g(x) + c*(x) 
f(l,2)4 
fWb0 
w4 -+ ChW 
g(x)+ 1 
gw + 1 
h(x)+2 
h(x)+2 
We can reduce f(g(O), h(O)) to at least two normal forms, namely, f( 1, q,(O)) and 
0. The trouble is that a reduction using a rule in RI (e.g., h(0) + q,(O)) 
commits the 
resulting term to the enclosing redex of R:. If the other non-constructor components 
of the redex refuse to “cooperate” by also reducing via RI, a deadlock results as 
in this example. Demanding a context-sensitive strategy for deciding the next redex 
to reduce destroys the effectiveness of the translation by reintroducing all the 
complexity of non-constructor systems. 
The difficulty in the example above is created by the overlap between the patterns 
f(g(x), h(y)) and h(x), producing a so-called critical pair. This is made precise in 
the following. 
efinition 3.1. R is said to be overlapping iff for some left-hand sides 4 1’ (I= 1’ is 
possible), u = 11 P is a proper subterm of 1, u is not a variable, and Unify( tr, I’) 
succeeds returning substitution (Y, The term r[ P = uar ] is called a superposition of I 
and I’. 
Confluent nonoverlapping systems have relatively simple rewriting behavior even 
when they are not regular in the technical sense; we therefore call such systems 
semiregulrrr. In the rest of this section, R is assumed to be semiregular. Since there 
are no syntactic conditions describing semiregularity, its preservation must be proved 
by showing directly that the translation R’ for a semiregular R is confluent. Actually, 
a slightly weaker property is proved because confluence m y not be preserved for 
all terms in TX*. 
. A term u E TX* is said to be reachable (via R’) iB 3t E Ts such that

![page004-img02.png](images/page004-img02.png)
![page004-img03.png](images/page004-img03.png)
![page004-img04.png](images/page004-img04.png)
![page004-img05.png](images/page004-img05.png)
![page004-img06.png](images/page004-img06.png)
![page004-img07.png](images/page004-img07.png)
![page004-img08.png](images/page004-img08.png)
![page004-img09.png](images/page004-img09.png)
![page004-img10.png](images/page004-img10.png)
![page004-img11.png](images/page004-img11.png)
![page004-img13.png](images/page004-img13.png)
![page004-img14.png](images/page004-img14.png)
![page004-img16.png](images/page004-img16.png)
![page004-img17.png](images/page004-img17.png)
![page004-img18.png](images/page004-img18.png)
![page004-img19.png](images/page004-img19.png)
![page004-img20.png](images/page004-img20.png)
![page004-img21.png](images/page004-img21.png)
![page004-img22.png](images/page004-img22.png)
![page004-img23.png](images/page004-img23.png)
![page004-img24.png](images/page004-img24.png)
![page004-img25.png](images/page004-img25.png)
![page004-img26.png](images/page004-img26.png)
![page004-img27.png](images/page004-img27.png)
![page004-img28.png](images/page004-img28.png)
![page004-img29.png](images/page004-img29.png)
![page004-img30.png](images/page004-img30.png)
![page004-img31.png](images/page004-img31.png)
![page004-img32.png](images/page004-img32.png)
![page004-img33.png](images/page004-img33.png)
![page004-img34.png](images/page004-img34.png)
![page004-img35.png](images/page004-img35.png)
![page004-img36.png](images/page004-img36.png)
![page004-img38.png](images/page004-img38.png)
![page004-img39.png](images/page004-img39.png)
![page004-img40.png](images/page004-img40.png)
![page004-img45.png](images/page004-img45.png)
![page004-img47.png](images/page004-img47.png)
![page004-img48.png](images/page004-img48.png)
![page004-img49.png](images/page004-img49.png)
![page004-img50.png](images/page004-img50.png)


---

## Page 5

First-order 
rewriting 
with constructor 
systems 
83 
3.3. If t is reachable, and H(t)=u-+t, in R, then 3w such that t +* w in Rt 
and H(w) = v. 
Proof. Suppose the equation (I, r) is used in R to derive u -, v. Then there is a P 
such that u/P = la, and v = u[ P = ra]. The symbol at the head of tf P 
of the form cf by the assumptions of reachability and nonoverlapping R. I 
any non-constructor subterms, the correspondin 
subterms of t/P an be reduced 
if necessary by the rules of RG so that t/P becomes an instance of I’ and the rule 
(1’, r) can be used to achieve the desired result. 
Cl 
Lemma 3.4. If t, w are reachable and u = H(t) = H(w), then there is a reachable v 
such that t +* v and w +* v in R’. 
Proof (sketch). It is easy to see that for any reachable t, H(t) +* t in R& Therefore 
u +* t and u +* w in R& Since the system RI is always terminating and confluent, 
v is simply the normal form of u in Ri. 
Cl 
Theorem 33. Rewriting sequences for reachable terms in R’ are confluent if R is 
semi-regular. 
Proof. Let t be reachable, and t +* 
u and t +* 
v in R’. By Lemma 2.1, there are 
derivations H ( t ) +* H(u) and H(t) +* H(v) in R. Since R is confluent, 3w such 
that H(u) +* w and H(v) +* w in R. By Lemma 3.3, there are w1 and w2 such that 
u -)* w1 and v +* w2 in R’, and w = H( w,) = H( w2). By Lemma 3.4, there is a w’ 
such that w1 ** w’ and wz +* w’ in R’. 0 
Since a constructor system is trivially nonoverlapping, this theorem proves that, 
in essence, semiregularity is preserved by our translation method. 
4. Canonical systems 
In addition to confluence, a canonical system is also assumed to be terminating 
(or Noetherian) which simply means that there are no infinite rewriting sequences 
in any of these systems. This class is particularly familiar in the context of theorem 
pry-king, and the famous Knuth-Bendix completion method [6] can be often used 
to mechanically transform a nonconfluent terminating system to an equivalent 
canonical one. In this section we describe a slight restriction of the notion of renNritin 
in a translation R’ under which canonicity is shown to be preserved. 
Arbitrary rewriting sequences in the translation of a 
are not always confluent, as shown by the example in Sectio 
sary to consider a

![page005-img02.png](images/page005-img02.png)
![page005-img03.png](images/page005-img03.png)
![page005-img04.png](images/page005-img04.png)
![page005-img05.png](images/page005-img05.png)
![page005-img06.png](images/page005-img06.png)
![page005-img07.png](images/page005-img07.png)
![page005-img08.png](images/page005-img08.png)
![page005-img09.png](images/page005-img09.png)
![page005-img10.png](images/page005-img10.png)
![page005-img11.png](images/page005-img11.png)
![page005-img13.png](images/page005-img13.png)
![page005-img14.png](images/page005-img14.png)
![page005-img15.png](images/page005-img15.png)
![page005-img17.png](images/page005-img17.png)
![page005-img18.png](images/page005-img18.png)
![page005-img19.png](images/page005-img19.png)
![page005-img20.png](images/page005-img20.png)
![page005-img21.png](images/page005-img21.png)
![page005-img22.png](images/page005-img22.png)
![page005-img23.png](images/page005-img23.png)
![page005-img24.png](images/page005-img24.png)
![page005-img25.png](images/page005-img25.png)
![page005-img27.png](images/page005-img27.png)
![page005-img28.png](images/page005-img28.png)
![page005-img29.png](images/page005-img29.png)
![page005-img30.png](images/page005-img30.png)
![page005-img31.png](images/page005-img31.png)
![page005-img32.png](images/page005-img32.png)
![page005-img33.png](images/page005-img33.png)
![page005-img34.png](images/page005-img34.png)
![page005-img35.png](images/page005-img35.png)
![page005-img36.png](images/page005-img36.png)
![page005-img37.png](images/page005-img37.png)
![page005-img38.png](images/page005-img38.png)
![page005-img39.png](images/page005-img39.png)
![page005-img40.png](images/page005-img40.png)
![page005-img45.png](images/page005-img45.png)
![page005-img47.png](images/page005-img47.png)
![page005-img49.png](images/page005-img49.png)
![page005-img50.png](images/page005-img50.png)


---

## Page 6

need not be considered equal. Actual computation is a~mplish 
RI with the rules in RI playing the auxili 
therefore consider a weakly ordered ve 
preferred over those in RI. This 
and sequences which we denote by - 
Defln1tso~ 4,1. tN+gf P = w] in R’ iff 
of the falls 
(1) t+tfP=w] 
in Ri; 
(2) t/P is no8 a redex in Rh and t-*i[P= 
w 
In other words, if a term is a redex in both R: 
the former rule. 
Notions such as confluence and 
U 
ordered rather than arbitrary rewri 
is 
a particularly oner0us one even 
since pies in JR: are 
apt to be implemented in a s 
anyway. However, the 
simul&n of R under o 
mplete for overlapping 
systems, Recall that Lemmas 2.1 and 2.2 are stated for arbitrary not ordered rewriting 
in R’. Lemma 2.1 continues to hold for ordered rewriting as a special case, but 
Lemma 2.2 does not hold for instances of superpositions (defined in Section 3). In 
addition to the prese 
we must therefore show that the normal 
forms of R can be p 
by ordered rewriting in R’. Both proofs 
hinge on the followi 
weaker version of Lemma 3.3. 
The p-f 
of this lemma requires the following auxiliary result. 
able by ordered mwitimg and H(t) + u in R, then them 
H(t)+oin 
R 
term z = H(t)/ P is replaced in the reduction H(t) + u. If z 
superposition, then t - 
ise, suppose 2 is an 
sition of I and I’, where the subterm 
unifies with I’. Clearly, 
there is a w such that H(t)/P.Q + w in R The proposition can now be reconsidered 
for this reduction. The process of lengthening the path in H(t) cannot go on 
indefinitely, therefore a Fedex in H(t) that is not an instance of a superposition will 
be reached eventually, yielding the required reduction H(t) 3 t) in R 
a 4.2 is to use a principle called Nwtherian

![page006-img03.png](images/page006-img03.png)
![page006-img04.png](images/page006-img04.png)
![page006-img05.png](images/page006-img05.png)
![page006-img06.png](images/page006-img06.png)
![page006-img07.png](images/page006-img07.png)
![page006-img08.png](images/page006-img08.png)
![page006-img09.png](images/page006-img09.png)
![page006-img10.png](images/page006-img10.png)
![page006-img11.png](images/page006-img11.png)
![page006-img13.png](images/page006-img13.png)
![page006-img14.png](images/page006-img14.png)
![page006-img15.png](images/page006-img15.png)
![page006-img16.png](images/page006-img16.png)
![page006-img17.png](images/page006-img17.png)
![page006-img18.png](images/page006-img18.png)
![page006-img19.png](images/page006-img19.png)
![page006-img20.png](images/page006-img20.png)
![page006-img21.png](images/page006-img21.png)
![page006-img22.png](images/page006-img22.png)
![page006-img23.png](images/page006-img23.png)
![page006-img24.png](images/page006-img24.png)
![page006-img25.png](images/page006-img25.png)
![page006-img26.png](images/page006-img26.png)
![page006-img27.png](images/page006-img27.png)
![page006-img28.png](images/page006-img28.png)
![page006-img29.png](images/page006-img29.png)
![page006-img30.png](images/page006-img30.png)
![page006-img31.png](images/page006-img31.png)
![page006-img32.png](images/page006-img32.png)
![page006-img33.png](images/page006-img33.png)
![page006-img34.png](images/page006-img34.png)
![page006-img35.png](images/page006-img35.png)
![page006-img36.png](images/page006-img36.png)
![page006-img37.png](images/page006-img37.png)
![page006-img38.png](images/page006-img38.png)
![page006-img39.png](images/page006-img39.png)
![page006-img40.png](images/page006-img40.png)
![page006-img45.png](images/page006-img45.png)
![page006-img47.png](images/page006-img47.png)
![page006-img48.png](images/page006-img48.png)
![page006-img49.png](images/page006-img49.png)
![page006-img50.png](images/page006-img50.png)


---

## Page 7

Proof of 
a 4.2. Lemma 4.2 can be expressed in the form of the predi 
(81 
defined as 
To show that this P is --complete, suppose 
+* u If H(t) = 4 there is nothin 
to prove; otherwise, by Proposition 46, the 
a w such that c-* w and H(t)+ 
H(w) in R Since + is co&tent, there is a z such that u + 
w E A*(t) (for -), we may ssume that there is a ~such that w-* G and t +* H(D), 
thus completing the proof. 0 
With Lemma 4.2, the normal forms of R and R’ (via ordered rewriting) are easily 
shown to be essentially identical. 
Theorem 4.4. For any term t E TX, t +* tl and u is irreducible in R if t-* v, tt is 
irreducible in R’ and H(v) = u. 
The “if” part is immediate from Lemma 2.1. To see the “only-if” part, given 
t +* 
u in R with u irreducible, we have t-* 
’ 
v in R’ and H(v’) = u by Lemma 4.2. 
This v’ can be reduced to its normal form v by ordered rewriting and H(v) = u by 
Lemma 2.1. 10 
Termination is obviously preserved by the translation, s 
preservation 
of 
canonicity reduces to the preservation of confluence. 
rem 4.5. If R is canonical, then ordered rewriting sequences for 
any term reachable 
by ordered rewriting are conquest. 
ose t is reachable by ordered 
t-* 
u and t-* 
a Suppose x’ is the normal for

![page007-img02.png](images/page007-img02.png)
![page007-img03.png](images/page007-img03.png)
![page007-img04.png](images/page007-img04.png)
![page007-img06.png](images/page007-img06.png)
![page007-img07.png](images/page007-img07.png)
![page007-img08.png](images/page007-img08.png)
![page007-img09.png](images/page007-img09.png)
![page007-img10.png](images/page007-img10.png)
![page007-img11.png](images/page007-img11.png)
![page007-img13.png](images/page007-img13.png)
![page007-img14.png](images/page007-img14.png)
![page007-img15.png](images/page007-img15.png)
![page007-img17.png](images/page007-img17.png)
![page007-img18.png](images/page007-img18.png)
![page007-img19.png](images/page007-img19.png)
![page007-img20.png](images/page007-img20.png)
![page007-img21.png](images/page007-img21.png)
![page007-img22.png](images/page007-img22.png)
![page007-img23.png](images/page007-img23.png)
![page007-img24.png](images/page007-img24.png)
![page007-img25.png](images/page007-img25.png)
![page007-img26.png](images/page007-img26.png)
![page007-img27.png](images/page007-img27.png)
![page007-img28.png](images/page007-img28.png)
![page007-img29.png](images/page007-img29.png)
![page007-img30.png](images/page007-img30.png)
![page007-img31.png](images/page007-img31.png)
![page007-img33.png](images/page007-img33.png)
![page007-img34.png](images/page007-img34.png)
![page007-img35.png](images/page007-img35.png)
![page007-img36.png](images/page007-img36.png)
![page007-img37.png](images/page007-img37.png)
![page007-img38.png](images/page007-img38.png)
![page007-img39.png](images/page007-img39.png)
![page007-img40.png](images/page007-img40.png)
![page007-img45.png](images/page007-img45.png)
![page007-img47.png](images/page007-img47.png)
![page007-img48.png](images/page007-img48.png)
![page007-img49.png](images/page007-img49.png)
![page007-img50.png](images/page007-img50.png)


---

## Page 8

occurs when the original 
relation-whkh 
we shall call 
systems. This condition is not co 
itrary contluence condition 
arbitrary rewriting is confluent in {f(g) -+ 
no doubt occur in p 
e properties of this case are rather similar to those 
.I, 2.2,3.3 and 3.4 hold when restated for (ordered) 
innermost rewriting. 
ost reduction in Rand - denote ordered innermost &reduction 
med to be confluent. The definition of reachability is now 
e proofs of the following lemmas are not difficult, and are only 
sketched here. 
, G~~ntundu~nT~,t 
- 
u in R” only if H( t) ** H(u) ~P.I 
R 
f. Similar to the proof of Lemma 2.1. Cl 
* 
t and u in TX, t-u 
in R only ift-* 
u in R’. 
e restriction to ordered rewriting in - 
is no restriction in simulating an 
ction in R since the subterms of such a redex cannot be redices of 
R”, . me rest follows as in the proof of L,emma 2.2. !J 
The proofs of the next two lemmas depend on the following proposition. 
If t is reachable and t/B ha 
symbol of the form cf at its head, 
tance oj*a right-hand side in 
Easy by induction on the length of the derivation reaching t. 
able, and H(t) = u* o in R, then 3w such that t-* w in R’ 
to 
01 at t 
osition 5.3, give 
umptions of reachability 
e rest follows as in the proofs of Lemmas 3.3 and 5.2. 0

![page008-img01.png](images/page008-img01.png)
![page008-img02.png](images/page008-img02.png)
![page008-img03.png](images/page008-img03.png)
![page008-img04.png](images/page008-img04.png)
![page008-img05.png](images/page008-img05.png)
![page008-img06.png](images/page008-img06.png)
![page008-img07.png](images/page008-img07.png)
![page008-img08.png](images/page008-img08.png)
![page008-img09.png](images/page008-img09.png)
![page008-img10.png](images/page008-img10.png)
![page008-img11.png](images/page008-img11.png)
![page008-img13.png](images/page008-img13.png)
![page008-img14.png](images/page008-img14.png)
![page008-img15.png](images/page008-img15.png)
![page008-img16.png](images/page008-img16.png)
![page008-img17.png](images/page008-img17.png)
![page008-img18.png](images/page008-img18.png)
![page008-img19.png](images/page008-img19.png)
![page008-img20.png](images/page008-img20.png)
![page008-img21.png](images/page008-img21.png)
![page008-img22.png](images/page008-img22.png)
![page008-img23.png](images/page008-img23.png)
![page008-img24.png](images/page008-img24.png)
![page008-img26.png](images/page008-img26.png)
![page008-img27.png](images/page008-img27.png)
![page008-img28.png](images/page008-img28.png)
![page008-img29.png](images/page008-img29.png)
![page008-img30.png](images/page008-img30.png)
![page008-img31.png](images/page008-img31.png)
![page008-img32.png](images/page008-img32.png)
![page008-img33.png](images/page008-img33.png)
![page008-img34.png](images/page008-img34.png)
![page008-img35.png](images/page008-img35.png)
![page008-img36.png](images/page008-img36.png)
![page008-img37.png](images/page008-img37.png)
![page008-img38.png](images/page008-img38.png)
![page008-img39.png](images/page008-img39.png)
![page008-img40.png](images/page008-img40.png)
![page008-img41.png](images/page008-img41.png)
![page008-img45.png](images/page008-img45.png)
![page008-img47.png](images/page008-img47.png)
![page008-img48.png](images/page008-img48.png)
![page008-img49.png](images/page008-img49.png)
![page008-img50.png](images/page008-img50.png)
![page008-img51.png](images/page008-img51.png)


---

## Page 9

Fkst-oder rehting 
with cimstmtor systems 
61 
If t, w are reachable and u = 
Suppose x and y ate the norm 
only the redices permitted to be redu 
claim that x = y is the required U. 
there is a P such that the symbo 
that at the head of 
is f itself. Let P be a maximal path which satisfies these 
conditions. Then by 
position 5.3, y/P must be a rede=. of R;. 
Since the corre- 
sponding redex in the precursors of x/P was reduced and since P is maximal a& 
x and y are reachable, y/P cannot be a redex of R:, 
thus contradict 
assumption that y is in normal form with respect to ordered reduction in 
rem 5.6. 
e relation - for reachable terms in I”‘# is confluent. 
Proof. Similar to the proof of the Theorem 3.5, replacing Lemmas 2.1,2.2,3.3 and 
3.4 by Lemmas 5.1, 5.2, 5.4 and 5.5. III 
6. Conclusions 
Considering its relatively narrow origin, our translation technique turns ,-ca’ko 
be surprisingly robust for very different classes of rewriting syste s under ordered 
rewriting (ordered rewriting is the same as arbitrary rewriting for semiregular 
systems). The main shortcoming of the technique is that certain important properties 
of the original system may not be fully preserved. A good example is sequentidity 
[S, 91; a regular system may be strongly sequential even though the corresponding 
constructor system is not, if the former does not belong to a special class called 
simple systems. 
The utility of the present technique is yet to be tested in practice, but it seems to 
offer the same advantages of simplicity and generality for first-order rewriting that 
combinators [IO] do for A-calculus dialects. 
AC 
gment 
I would like to thank Michael 
roblem and Joseph Goguen for 
extensions. 
O’Donnell for encouragement in pursuing this 
asking questions that Ied me to consi 
[I] K. Futatsugi et al., Principles of OBJ2, in: Pbc. 12th RX?& New Orleans (1985) 52-66. 
[2] C.M. Hoffmann and M. O’Donnell, 
Programming with equations, ACM TOPLAS 4(l) (1982) 
83-l 12.

![page009-img02.png](images/page009-img02.png)
![page009-img03.png](images/page009-img03.png)
![page009-img04.png](images/page009-img04.png)
![page009-img05.png](images/page009-img05.png)
![page009-img06.png](images/page009-img06.png)
![page009-img07.png](images/page009-img07.png)
![page009-img08.png](images/page009-img08.png)
![page009-img09.png](images/page009-img09.png)
![page009-img10.png](images/page009-img10.png)
![page009-img11.png](images/page009-img11.png)
![page009-img14.png](images/page009-img14.png)
![page009-img15.png](images/page009-img15.png)
![page009-img16.png](images/page009-img16.png)
![page009-img17.png](images/page009-img17.png)
![page009-img18.png](images/page009-img18.png)
![page009-img19.png](images/page009-img19.png)
![page009-img20.png](images/page009-img20.png)
![page009-img21.png](images/page009-img21.png)
![page009-img22.png](images/page009-img22.png)
![page009-img23.png](images/page009-img23.png)
![page009-img24.png](images/page009-img24.png)
![page009-img25.png](images/page009-img25.png)
![page009-img26.png](images/page009-img26.png)
![page009-img27.png](images/page009-img27.png)
![page009-img29.png](images/page009-img29.png)
![page009-img30.png](images/page009-img30.png)
![page009-img31.png](images/page009-img31.png)
![page009-img32.png](images/page009-img32.png)
![page009-img33.png](images/page009-img33.png)
![page009-img34.png](images/page009-img34.png)
![page009-img36.png](images/page009-img36.png)
![page009-img37.png](images/page009-img37.png)
![page009-img38.png](images/page009-img38.png)
![page009-img39.png](images/page009-img39.png)
![page009-img40.png](images/page009-img40.png)
![page009-img45.png](images/page009-img45.png)
![page009-img47.png](images/page009-img47.png)
![page009-img48.png](images/page009-img48.png)
![page009-img49.png](images/page009-img49.png)
![page009-img50.png](images/page009-img50.png)


---

## Page 10

92 
s llsotte 
131 CM. Hoffmann and M. O’Donnell, Implementation of an interpreter for a 
cations, in: 
Proc. flzh PYIPL, Salt Lake City (1984) 111-121. 
G. Huet, Confluent reductions: abstract groperties and applications to term-rewritin 
ACM n(4) (1980) 797-821. 
[5] 6. Huet and J-J. Levy, Computations in nonambiguous linear term-rewritin systems, Tech. Rept. 
359, INRIA, France (1979). 
[6J D. Knuth and P. Rendix, Simpte word problems in universal 
h, ed*, ~ompu~ut~ona~ 
Roblems irr Abstruzct Alg&u (Pergamon Press, Oxford, 19 
[7 ] R Milner, A proposal for standard ML, in: PLac. ACM Symp. on LISPand Functionul hgtxamming, 
[8] S.R. Thatte, Gn the correspondence between two classes of reduction systems, Inform. hcess 
Len 
2Q (1985) 83-85. 
[9] S.R. Thatte, A refinement of strong sequentiality for term-rewriting with constructors, Inform. and 
[lo] D. Turner, A new implementation technique for applicative languages, Sc@wure hctice 
and 
Experience 9 (1979) 31-49. 
[ 1 l] D. Turner, An overview of Miranda, SIG&W 
IVorices 21( 12) (i986) 1%166.

![page010-img02.png](images/page010-img02.png)
![page010-img03.png](images/page010-img03.png)
![page010-img04.png](images/page010-img04.png)
![page010-img05.png](images/page010-img05.png)
![page010-img06.png](images/page010-img06.png)
![page010-img07.png](images/page010-img07.png)
![page010-img08.png](images/page010-img08.png)
![page010-img09.png](images/page010-img09.png)
![page010-img14.png](images/page010-img14.png)
![page010-img23.png](images/page010-img23.png)
![page010-img34.png](images/page010-img34.png)
![page010-img45.png](images/page010-img45.png)
![page010-img47.png](images/page010-img47.png)
![page010-img48.png](images/page010-img48.png)
![page010-img49.png](images/page010-img49.png)
![page010-img50.png](images/page010-img50.png)


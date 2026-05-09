---
title: "Life is probably full of bugs Writeup"
date: 2026-05-09T00:00:00+09:00
draft: false
tags:
  - Writeup
  - Crypto
---

{{< katex >}}

# Life is probably full of bugs

## Challenge

> Life is probably full of bugs

```py
import os
import secrets
from Crypto.Util.number import isPrime, getPrime, bytes_to_long

e = 65537
D = 3
bits = 1024
FLAG = os.environ.get("FLAG", "Alpaca{REDACTED}")

while True:
    V = secrets.randbelow(max(1 << (bits - 1), (1 << bits) - 1))
    if V % 2 == 0:
        V += 1
    p = (D * V**2 + 1) // 4
    if isPrime(p):
        break

q = getPrime(bits)
if q == p:
    q = getPrime(bits)
N = p * q

m = bytes_to_long(FLAG.encode())
assert m < N
c = pow(m, e, N)

print("N =", N)
print("e =", e)
print("c =", c)
```

This is an RSA challenge where the prime \\(p\\) has the special form

$$
p=\frac{3V^2+1}{4}.
$$

The explanation below follows reference [1].

## Background

### Elliptic curves over a general field

An elliptic curve over a field \\(K\\) is written as

$$
E/\mathbb{K}:y^2=x^3+Ax+B,\quad A,B\in K,\quad 4A^3+27B^2\ne 0.
$$

The set of points \\(E(\mathbb{K})\\) is defined as

$$
E(\mathbb{K})=\{(x,y)\in \mathbb{K}\times\mathbb{K}:y^2=x^3+Ax+B\}\cup\{\mathcal{O}\}.
$$

Here \\(\mathcal{O}\\) is the point at infinity, which is the identity element for addition.

For any point \\(P\in E(\mathbb{K})\\), scalar multiplication \\(mP(m\in \mathbb{N})\\) is defined by repeated addition:

$$
mP = P + P + \cdots + P(m\text{ times})\in E(\mathbb{K}).
$$

In affine coordinates, \\(mP\\) can be represented as

$$
mP=\left(\frac{a_m}{d_m^2},\frac{b_m}{d_m^3}\right).
$$

The following equivalence also holds:

$$
mP=O\Longleftrightarrow d_m=0.
$$

### j-invariant and twists

For an elliptic curve

$$
E:y^2=x^3+Ax+B,
$$

the \\(j\\)-invariant is defined as

$$
j=\frac{4\cdot 1728A^3}{4A^3+27B^2}.
$$

As described later, this challenge uses \\(j=0\\), so we focus on that case. Curves with \\(j=0\\) have the following form:

| Condition | Curve |
|---|---|
| \\(j_0=0\\) | \\(y^2=x^3+R\\) |

### Elliptic curves over finite fields

For an elliptic curve over a finite field \\(\mathbb{F}_p\\), the number of points is written as

$$
\\#E(\mathbb{F}_p)=p+1-t.
$$

This \\(t\\) is called the trace, or the Frobenius trace. In particular, a curve satisfying

$$
\\#E(\mathbb{F}_p)=p
$$

that is, a curve with trace \\(1\\), is called an anomalous curve.

From [2], the following fact is known:

$$
\\#\mathrm{Twist}(E)=
\begin{cases}
2 & \text{if the j-invariant of E is neither 0 nor 1728},\\\\
4 & \text{if the j-invariant of E is 1728},\\\\
6 & \text{if the j-invariant of E is 0}.
\end{cases}
$$

Also, let \\(E/\mathbb{F}_p\\) be an elliptic curve over the finite field \\(\mathbb{F}_p\\), and let

$$
n = \\#E(\mathbb{F}_p).
$$

Then for any point \\(P\in E(\mathbb{F}_p)\\),

$$
nP=\mathcal{O}
$$

holds.

### CM method and class polynomials

Let \\(D\in\mathbb{Z}\\) be a non-square integer and let \\(p\\) be a prime satisfying

$$
4p-t^2 = DV^2,
$$

where \\(t\neq 0\\) and \\(V\in\mathbb{Z}\\). Also, let \\(H_D(j)\\) be the class polynomial of discriminant \\(D\\).

Then an elliptic curve \\(E\\) over \\(\mathbb{F}_p\\) whose \\(j\\)-invariant is a root \\(j_0\\) of \\(H_D(j)\\), or a twist \\(E'\\) of that curve, has trace \\(t\\).

If \\(E\\) is constructed from \\(j_0\\), the probability that \\(E\\) has trace \\(t\\) is

$$
\begin{cases}
1/6 & \text{if } D=3,\\\\
1/4 & \text{if } D=1,\\\\
1/2 & \text{otherwise}.
\end{cases}
$$

## Vulnerability in this challenge

### Basic idea

If a prime factor \\(p\\) of \\(N\\) has the form

$$
p=\frac{DV^2+1}{4},
$$

then

$$
4p-1=DV^2
$$

for \\(D,V\in \mathbb{Z}\\). Interpreting this as the case \\(t=1\\), \\(E_p\\) becomes anomalous with the probability described above.

By Lagrange's theorem, if the trace is \\(1\\), then

$$
\\#E(\mathbb{F}_p)=p.
$$

Therefore,

$$
pP_p=\mathcal{O}_p.
$$

Since \\(N=pq\\),

$$
NP_p=(pq)P_p=q(pP_p)=\mathcal{O}_p.
$$

The important point is that \\(N\\) is composite, so \\(\mathbb{Z}_N\\) is not a field. During point addition, divisions of the form \\(\alpha/\beta\\) appear. If

$$
\gcd(N,\beta)=1,
$$

then the inverse exists and the computation proceeds normally. On the other hand, if

$$
1<\gcd(N,\beta)<N,
$$

then this \\(\gcd\\) is a non-trivial factor of \\(N\\).

More precisely, write \\(kP\\) as

$$
kP=\left(\frac{a_k}{d_k^2},\frac{b_k}{d_k^3}\right),
$$

and define

$$
d_{k, p} := d_k \pmod p.
$$

If

$$
kP_p=\mathcal{O}_p,
$$

then

$$
d_{k, p}= 0.
$$

This is equivalent to \\(d_k\\) being a multiple of \\(p\\). Therefore, if we compute

$$
g=\gcd(N,d_k),
$$

and \\(g \ne 0\\), then \\(g\\) is a non-trivial divisor of \\(N\\), meaning it is a multiple of \\(p\\).

### Setting for solving primes of this form

In this challenge, \\(D=3\\), so

$$
p=\frac{3V^2+1}{4}.
$$

Therefore, the only required class polynomial is the one for \\(D=3\\).

| \\(D\\) | \\(H_D(j)\\) |
|---:|---|
| \\(3\\) | \\(j\\) |

In other words,

$$
H_3(j)=j,
$$

and its root is

$$
j_0=0.
$$

Thus, it is enough to use a curve of the form

$$
E:y^2=x^3+B.
$$

Choose random \\(x,y\in\mathbb{Z}_N\\) and set

$$
B=y^2-x^3.
$$

Then, by definition,

$$
y^2=x^3+B,
$$

so

$$
P=(x,y)\in E(\mathbb{Z}_N).
$$

From the probability described earlier, this attack succeeds with probability \\(\frac{1}{6}\\).

## Algorithm

1. Choose random \\(x_0,y_0\in\mathbb{Z}_N\\).
2. Set \\(B=y_0^2-x_0^3\\).
3. Construct \\(E/\mathbb{Z}_N:y^2=x^3+B\\).
4. Set \\(P=(x_0,y_0)\\).
5. Compute \\(NP\\).
6. Compute \\(g=\gcd(N,d_N)\\) for the denominator \\(d_N\\).
7. If \\(1<g<N\\), then \\(g\\) is a prime factor.
8. If it fails, retry with different \\(x_0,y_0\\).

In SageMath version 9, encountering a value without an inverse over \\(\mathbb{Z}_N\\) raises a `ZeroDivisionError`. The value included in this error corresponds to the denominator, so we take the gcd of that value and \\(N\\).

In SageMath version 10, that value appears in the \\(Z\\) component of the projective coordinates, so we take the gcd of this \\(Z\\) component and \\(N\\).

```py
import secrets
import re
from Crypto.Util.number import long_to_bytes

from sage.all import *

N = 331870752672014044147181737213412265816523398759615097525139943745771796210285641753397448357034246227758902399979980100515869028774495881259087973250414629281616256673215740614627279222216892287315839494738673533606415338614910770016326702863476621524055282218717990186070218733351509983642415795104346431996804760168955771990411604175165533190602779739268458359854567217134178322927674138876033790911485253556339367464609524645236034199126092787214934713729184221556626485050407422356315907375366959491219626930689355708106915958318935132543131885987076770142681617098974942011563094271188148568855545969095659093800528446912366013535883549657435233957417498281715562124870001144941819675972314842967923288388867960885311992990946028062381240832830506983130996065984416598586021861754119890976275431390726334265905113682082124286691261365801512029848055541389244928274789072868460518572844418477155878801582341572611988431
e = 65537
c = 236295471689740812505534297929776166772230487944897586528275996313476392922101434917708323182972259085517756077698022562556571344836160008877823086658496427525484541816350490066191094376031331588390626750932068822765849532151875048171239488285236932022406536346403199170597031855615328952119177480297569446206867883697875282481420825400971358757678940609305080869495307401953703856417400143035353334696098250915694539028811098974225685730119420661858730616172801478853113561819100764185654102779314050492399799517374934236308687335707876729350908255980585753593111532330811793257046754572488996805570304364492607639321260941111295044137670658741360932069744523665920425619909456645036449386828578036925231188180317472027040431729571764670280822879125187612385724885122670480018785566324155865816458829915767109906969883185680233265251055818532204763281485948242327516716072755766969026316961727158396694728526179105023703302

R = Zmod(N)


def denom_from_zerodiv(ex):
    m = re.search(r"Inverse of\s+(.*?)\s+does not exist", str(ex), flags=re.S)
    if not m:
        return None
    digits = re.findall(r"\d+", m.group(1))
    if not digits:
        return None
    return int("".join(digits))


p = None
for _ in range(50):
    x = secrets.randbelow(N)
    y = secrets.randbelow(N)

    B = (pow(y, 2, N) - pow(x, 3, N)) % N
    E = EllipticCurve(R, [0, B])
    P = E(R(x), R(y))

    try:
        Q = N * P
        g = gcd(int(Q[2]), N)
        if 1 < g < N:
            p = int(g)
            break
    except ZeroDivisionError as err:
        dnm = denom_from_zerodiv(err)
        if dnm is None:
            continue
        g = gcd(dnm, N)
        if 1 < g < N:
            p = int(g)
            break

if p is None:
    raise RuntimeError("factor failed")

q = N // p
d = inverse_mod(e, (p - 1) * (q - 1))
m = power_mod(c, d, N)
print(long_to_bytes(int(m)).decode())
```

The flag is:

```text
Alpaca{mirai_tte_kakikake_no_note_jan!!!_82ed9780f16b85f27e69eadbdba4b6625537183b8aebe574678bcb1d46168d43}
```

## Appendix

The challenge statement and flag are references to "Tabun Jinsei wa Bug Darake" by Aogiri High School.

I especially like the line about the future being an unfinished notebook. Please give the song a listen if you are interested.

https://www.youtube.com/watch?v=WhtLblWwoXU

## Reference
[1] Masaaki Shirase, “Condition on composite numbers easily factored with elliptic curve method,” Cryptology ePrint Archive, Paper 2017/403, 2017. Available: https://eprint.iacr.org/2017/403

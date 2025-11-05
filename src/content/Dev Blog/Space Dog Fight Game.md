---
date: 2025-06-30
draft: true
---
# !!! WIP !!!

>[github.com/will-pettifer/SpaceDogFight](https://github.com/will-pettifer/SpaceDogFight)
>
>Maths: </br>
>&nbsp;&nbsp;&nbsp;⚘ [Sine](#sine) </br>
>&nbsp;&nbsp;&nbsp;⚘ [Vectors and Matrices](#vectors-and-matrices) </br>
>&nbsp;&nbsp;&nbsp;⚘ [Quaternions](#quaternions) </br>
>
>Rendering: </br>
>&nbsp;&nbsp;&nbsp;⚘
>
>Physics: </br>
>&nbsp;&nbsp;&nbsp;⚘ [Pheromone Grid](#pheromone-grid) </br>
>&nbsp;&nbsp;&nbsp;⚘ [Reflections](#reflections)

This project was made using OpenGL/OpenTK and was written in C#. It includes basic 3D rendering and a physics engine. My aim with this project was to better understand the maths behind games and 3D rendering, so I avoided using external maths libraries. This meant I had to implement vectors, matrices, quaternions, and even my own sine function.

# Maths
### Sine
I reviewed a few different options for this, such as a Taylor series or a CORDIC algorithm, but in the end I decided this would be the simplest. I used Bhāskara I's sine approximation, which is a really simple formula:

$$sin(x)\approx\frac{16x(\pi-x)}{5\pi^2-4x(\pi-x)}$$

Or for cosine:

$$cos(y)\approx\frac{\pi^2-4y^2}{\pi^2+y^2}$$

This produces this graph, where blue is cosine, red is the formula:

![](space-dog-sine-graph.png)

Which can then be translated to account for the lack of repetition of the curve:

```csharp
public static float Sin(float rad) => Cos(rad - TauOver4);
public static float Cos(float rad)
{
    rad %= Tau;
    rad = Abs(rad);
    
    int sign = 1;
    switch (rad)
    {
        case < TauOver4:
            break;
        case < Pi:
            sign = -1;
            rad = TauOver4 - (rad - TauOver4);
            break;
        case < Tau3Over4:
            sign = -1;
            rad -= Pi;
            break;
        case <= Tau:
            rad = Pi - (rad - Pi);
            break;
    }
    return sign * ((PiSqr - 4 * rad * rad) / (PiSqr + rad * rad));
}
```

### Vectors and Matrices
I included 2D, 3D, and 4D vectors. For the matrix classes, I included 2x2 (which was basically just used for inverting 3x3 matrices), 3x3 (which was used for the physics), and 4x4 (which is essential for graphics). Contrary to what is typically done, I decided to store matrices by their columns rather than by their rows:

```csharp
public class Mat4
{
    public Vec4 C0, C1, C2, C3;
    ...
}
```

A 2D vector can be thought of as a scaling of the unit vectors, so you go along the x-axis by 4, and then along the y-axis by 3:

$$4\begin{bmatrix}1\\0\end{bmatrix}+3\begin{bmatrix}0\\1\end{bmatrix}=\begin{bmatrix}4\\3\end{bmatrix}$$

If the unit vectors are changed, then the vector is transformed into the space that those unit vectors now represent. These unit vectors can be represented as the columns of a matrix:

$$\begin{bmatrix}1&0\\0&1\end{bmatrix}\begin{bmatrix}4\\3\end{bmatrix}=\begin{bmatrix}4\\3\end{bmatrix}$$

This is how matrices represent the rotation, scaling, and shearing of the input vectors, but the actual transformation is just the multiplication of the columns by each component of the vector. This is why I stored the columns rather than the rows, and it made the multiplication much simpler:

```csharp
public static Mat3 operator *(Mat3 b, Mat3 a)
    => new(b.C0 * a, b.C1 * a, b.C2 * a);
public static Vec3 operator *(Vec3 v, Mat3 m)
    => v.X * m.C0 + v.Y * m.C1 + v.Z * m.C2;
```

I also implemented a function to invert 3x3 matrices by finding the determinant of the minor of each element, changing the signs, transposing it, and then dividing by the determinant:

```csharp
public Mat3 Inverse()
{
    float[,] matTemp =
    {
        { C0.X, C0.Y, C0.Z },
        { C1.X, C1.Y, C1.Z },
        { C2.X, C2.Y, C2.Z }
    };
    float[,] result =
    {
        { 0, 0, 0 },
        { 0, 0, 0 },
        { 0, 0, 0 }
    };
    for (int c = 0; c < 3; c++)
    {
        for (int r = 0; r < 3; r++)
        {
            result[c, r] = Minor(matTemp, c, r);
        }
    }
    
    Mat3 matResult = new(result);
    matResult.C0.Y *= -1;
    matResult.C1.X *= -1;
    matResult.C1.Z *= -1;
    matResult.C2.Y *= -1;
    
    matResult = matResult.Transpose();
    return matResult / Determinant();
}

public float Minor(float[,] mat, int c, int r)
{
    float[,] result = { { 1, 0 }, { 0, 1 } };
    int xx = 0;
    for (int col = 0; col < 3; col++)
    {
        if (col == c)
        {
            continue;
        }
        int yy = 0;
        for (int row = 0; row < 3; row++)
        {
            if (row == r)
            {
                continue;
            }
            result[xx, yy] = mat[col, row];
            yy++; 
        }

        xx++;
    }
    return new Mat2(result).Determinant();
}
```

### Quaternions



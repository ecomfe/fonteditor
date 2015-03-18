using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bezier
{


    public class Point
    {
        public double X { get; set; }
        public double Y { get; set; }

        public double Length
        {
            get
            {
                return Math.Sqrt(X * X + Y * Y);
            }
        }
        public Point(double x = 0, double y = 0)
        {
            X = x;
            Y = y;
        }

        public Point(Point p)
        {
            X = p.X;
            Y = p.Y;
        }

        public static Point operator *(Point left, double right)
        {
            return new Point(left.X * right, left.Y * right);
        }

        public static Point operator /(Point left, double right)
        {
            return new Point(left.X / right, left.Y / right);
        }

        public static Point operator +(Point left, Point right)
        {
            return new Point(left.X + right.X, left.Y + right.Y);
        }

        public static Point operator -(Point left, Point right)
        {
            return new Point(left.X - right.X, left.Y - right.Y);
        }

        internal void Negate()
        {
            X = -X;
            Y = -Y;
        }

        internal void Normalize()
        {
            double factor = 1.0 / Math.Sqrt(LengthSquared);
            X *= factor;
            Y *= factor;
        }

        public double LengthSquared { get { return X * X + Y * Y; } }


        public static Point Add(Point a, Point b)
        {
            return new Point(a.X + b.X, a.Y + b.Y);
        }

        public static Point Subtract(Point a, Point b)
        {
            return new Point(a.X - b.X, a.Y - b.Y);
        }
    }


    /*
    An Algorithm for Automatically Fitting Digitized Curves
    by Philip J. Schneider
    from "Graphics Gems", Academic Press, 1990
    */
    public static class FitCurves
    {
        /*  Fit the Bezier curves */

        private const int MAXPOINTS = 10000;
        public static List<Point> FitCurve(Point[] d, double error)
        {
            Point tHat1, tHat2;    /*  Unit tangent vectors at endpoints */

            tHat1 = ComputeLeftTangent(d, 0);
            tHat2 = ComputeRightTangent(d, d.Length - 1);
            List<Point> result = new List<Point>();
            FitCubic(d, 0, d.Length - 1, tHat1, tHat2, error, result);
            return result;
        }


        private static void FitCubic(Point[] d, int first, int last, Point tHat1, Point tHat2, double error, List<Point> result)
        {
            Point[] bezCurve; /*Control points of fitted Bezier curve*/
            double[] u;     /*  Parameter values for point  */
            double[] uPrime;    /*  Improved parameter values */
            double maxError;    /*  Maximum fitting error    */
            int splitPoint; /*  Point to split point set at  */
            int nPts;       /*  Number of points in subset  */
            double iterationError; /*Error below which you try iterating  */
            int maxIterations = 4; /*  Max times to try iterating  */
            Point tHatCenter;      /* Unit tangent vector at splitPoint */
            int i;

            iterationError = error * error;
            nPts = last - first + 1;

            /*  Use heuristic if region only has two points in it */
            if (nPts == 2)
            {
                double dist = (d[first] - d[last]).Length / 3.0;

                bezCurve = new Point[4];
                bezCurve[0] = d[first];
                bezCurve[3] = d[last];
                bezCurve[1] = (tHat1 * dist) + bezCurve[0];
                bezCurve[2] = (tHat2 * dist) + bezCurve[3];

                result.Add(bezCurve[1]);
                result.Add(bezCurve[2]);
                result.Add(bezCurve[3]);
                return;
            }

            /*  Parameterize points, and attempt to fit curve */
            u = ChordLengthParameterize(d, first, last);
            bezCurve = GenerateBezier(d, first, last, u, tHat1, tHat2);

            /*  Find max deviation of points to fitted curve */
            maxError = ComputeMaxError(d, first, last, bezCurve, u, out splitPoint);
            if (maxError < error)
            {
                result.Add(bezCurve[1]);
                result.Add(bezCurve[2]);
                result.Add(bezCurve[3]);
                return;
            }


            /*  If error not too large, try some reparameterization  */
            /*  and iteration */
            if (maxError < iterationError)
            {
                for (i = 0; i < maxIterations; i++)
                {
                    uPrime = Reparameterize(d, first, last, u, bezCurve);
                    bezCurve = GenerateBezier(d, first, last, uPrime, tHat1, tHat2);
                    maxError = ComputeMaxError(d, first, last,
                               bezCurve, uPrime, out splitPoint);
                    if (maxError < error)
                    {
                        result.Add(bezCurve[1]);
                        result.Add(bezCurve[2]);
                        result.Add(bezCurve[3]);
                        return;
                    }
                    u = uPrime;
                }
            }

            /* Fitting failed -- split at max error point and fit recursively */
            tHatCenter = ComputeCenterTangent(d, splitPoint);
            FitCubic(d, first, splitPoint, tHat1, tHatCenter, error, result);
            tHatCenter.Negate();
            FitCubic(d, splitPoint, last, tHatCenter, tHat2, error, result);
        }

        static Point[] GenerateBezier(Point[] d, int first, int last, double[] uPrime, Point tHat1, Point tHat2)
        {
            int i;
            Point[,] A = new Point[MAXPOINTS, 2];/* Precomputed rhs for eqn    */

            int nPts;           /* Number of pts in sub-curve */
            double[,] C = new double[2, 2];            /* Matrix C     */
            double[] X = new double[2];          /* Matrix X         */
            double det_C0_C1,      /* Determinants of matrices */
                    det_C0_X,
                    det_X_C1;
            double alpha_l,        /* Alpha values, left and right */
                    alpha_r;
            Point tmp;            /* Utility variable     */
            Point[] bezCurve = new Point[4];    /* RETURN bezier curve ctl pts  */
            nPts = last - first + 1;

            /* Compute the A's  */
            for (i = 0; i < nPts; i++)
            {
                Point v1, v2;
                v1 = tHat1;
                v2 = tHat2;
                v1 *= B1(uPrime[i]);
                v2 *= B2(uPrime[i]);
                A[i, 0] = v1;
                A[i, 1] = v2;
            }

            /* Create the C and X matrices  */
            C[0, 0] = 0.0;
            C[0, 1] = 0.0;
            C[1, 0] = 0.0;
            C[1, 1] = 0.0;
            X[0] = 0.0;
            X[1] = 0.0;

            for (i = 0; i < nPts; i++)
            {
                C[0, 0] += V2Dot(A[i, 0], A[i, 0]);
                C[0, 1] += V2Dot(A[i, 0], A[i, 1]);
                /*                  C[1][0] += V2Dot(&A[i][0], &A[i][9]);*/
                C[1, 0] = C[0, 1];
                C[1, 1] += V2Dot(A[i, 1], A[i, 1]);

                tmp = ((Point)d[first + i] -
                    (
                      ((Point)d[first] * B0(uPrime[i])) +
                        (
                            ((Point)d[first] * B1(uPrime[i])) +
                                    (
                                    ((Point)d[last] * B2(uPrime[i])) +
                                        ((Point)d[last] * B3(uPrime[i]))))));


                X[0] += V2Dot(A[i, 0], tmp);
                X[1] += V2Dot(A[i, 1], tmp);
            }

            /* Compute the determinants of C and X  */
            det_C0_C1 = C[0, 0] * C[1, 1] - C[1, 0] * C[0, 1];
            det_C0_X = C[0, 0] * X[1] - C[1, 0] * X[0];
            det_X_C1 = X[0] * C[1, 1] - X[1] * C[0, 1];

            /* Finally, derive alpha values */
            alpha_l = (det_C0_C1 == 0) ? 0.0 : det_X_C1 / det_C0_C1;
            alpha_r = (det_C0_C1 == 0) ? 0.0 : det_C0_X / det_C0_C1;

            /* If alpha negative, use the Wu/Barsky heuristic (see text) */
            /* (if alpha is 0, you get coincident control points that lead to
             * divide by zero in any subsequent NewtonRaphsonRootFind() call. */
            double segLength = (d[first] - d[last]).Length;
            double epsilon = 1.0e-6 * segLength;
            if (alpha_l < epsilon || alpha_r < epsilon)
            {
                /* fall back on standard (probably inaccurate) formula, and subdivide further if needed. */
                double dist = segLength / 3.0;
                bezCurve[0] = d[first];
                bezCurve[3] = d[last];
                bezCurve[1] = (tHat1 * dist) + bezCurve[0];
                bezCurve[2] = (tHat2 * dist) + bezCurve[3];
                return (bezCurve);
            }

            /*  First and last control points of the Bezier curve are */
            /*  positioned exactly at the first and last data points */
            /*  Control points 1 and 2 are positioned an alpha distance out */
            /*  on the tangent vectors, left and right, respectively */
            bezCurve[0] = d[first];
            bezCurve[3] = d[last];
            bezCurve[1] = (tHat1 * alpha_l) + bezCurve[0];
            bezCurve[2] = (tHat2 * alpha_r) + bezCurve[3];
            return (bezCurve);
        }

        /*
         *  Reparameterize:
         *  Given set of points and their parameterization, try to find
         *   a better parameterization.
         *
         */
        static double[] Reparameterize(Point[] d, int first, int last, double[] u, Point[] bezCurve)
        {
            int nPts = last - first + 1;
            int i;
            double[] uPrime = new double[nPts];      /*  New parameter values    */

            for (i = first; i <= last; i++)
            {
                uPrime[i - first] = NewtonRaphsonRootFind(bezCurve, d[i], u[i - first]);
            }
            return uPrime;
        }



        /*
         *  NewtonRaphsonRootFind :
         *  Use Newton-Raphson iteration to find better root.
         */
        static double NewtonRaphsonRootFind(Point[] Q, Point P, double u)
        {
            double numerator, denominator;
            Point[] Q1 = new Point[3], Q2 = new Point[2];   /*  Q' and Q''          */
            Point Q_u, Q1_u, Q2_u; /*u evaluated at Q, Q', & Q''  */
            double uPrime;     /*  Improved u          */
            int i;

            /* Compute Q(u) */
            Q_u = BezierII(3, Q, u);

            /* Generate control vertices for Q' */
            for (i = 0; i <= 2; i++)
            {
                Q1[i] = new Point((Q[i + 1].X - Q[i].X) * 3.0,(Q[i + 1].Y - Q[i].Y) * 3.0 );
            }

            /* Generate control vertices for Q'' */
            for (i = 0; i <= 1; i++)
            {
                Q2[i] = new Point((Q[i + 1].X - Q[i].X) * 2.0, (Q[i + 1].Y - Q[i].Y) * 2.0);
            }

            /* Compute Q'(u) and Q''(u) */
            Q1_u = BezierII(2, Q1, u);
            Q2_u = BezierII(1, Q2, u);

            /* Compute f(u)/f'(u) */
            numerator = (Q_u.X - P.X) * (Q1_u.X) + (Q_u.Y - P.Y) * (Q1_u.Y);
            denominator = (Q1_u.X) * (Q1_u.X) + (Q1_u.Y) * (Q1_u.Y) +
                          (Q_u.X - P.X) * (Q2_u.X) + (Q_u.Y - P.Y) * (Q2_u.Y);
            if (denominator == 0.0f) return u;

            /* u = u - f(u)/f'(u) */
            uPrime = u - (numerator / denominator);
            return (uPrime);
        }



        /*
         *  Bezier :
         *      Evaluate a Bezier curve at a particular parameter value
         *
         */
        static Point BezierII(int degree, Point[] V, double t)
        {
            int i, j;
            Point Q;          /* Point on curve at parameter t    */
            Point[] Vtemp;      /* Local copy of control points     */

            /* Copy array   */
            Vtemp = new Point[degree + 1];
            for (i = 0; i <= degree; i++)
            {
                Vtemp[i] = new Point(V[i]);
            }

            /* Triangle computation */
            for (i = 1; i <= degree; i++)
            {
                for (j = 0; j <= degree - i; j++)
                {
                    Vtemp[j].X = (1.0 - t) * Vtemp[j].X + t * Vtemp[j + 1].X;
                    Vtemp[j].Y = (1.0 - t) * Vtemp[j].Y + t * Vtemp[j + 1].Y;
                }
            }

            Q = Vtemp[0];
            return Q;
        }


        /*
         *  B0, B1, B2, B3 :
         *  Bezier multipliers
         */
        static double B0(double u)
        {
            double tmp = 1.0 - u;
            return (tmp * tmp * tmp);
        }


        static double B1(double u)
        {
            double tmp = 1.0 - u;
            return (3 * u * (tmp * tmp));
        }

        static double B2(double u)
        {
            double tmp = 1.0 - u;
            return (3 * u * u * tmp);
        }

        static double B3(double u)
        {
            return (u * u * u);
        }

        /*
         * ComputeLeftTangent, ComputeRightTangent, ComputeCenterTangent :
         *Approximate unit tangents at endpoints and "center" of digitized curve
         */
        static Point ComputeLeftTangent(Point[] d, int end)
        {
            Point tHat1;
            tHat1 = d[end + 1] - d[end];
            tHat1.Normalize();
            return tHat1;
        }

        static Point ComputeRightTangent(Point[] d, int end)
        {
            Point tHat2;
            tHat2 = d[end - 1] - d[end];
            tHat2.Normalize();
            return tHat2;
        }

        static Point ComputeCenterTangent(Point[] d, int center)
        {
            Point V1, V2, tHatCenter = new Point();

            V1 = d[center - 1] - d[center];
            V2 = d[center] - d[center + 1];
            tHatCenter.X = (V1.X + V2.X) / 2.0;
            tHatCenter.Y = (V1.Y + V2.Y) / 2.0;
            tHatCenter.Normalize();
            return tHatCenter;
        }


        /*
         *  ChordLengthParameterize :
         *  Assign parameter values to digitized points
         *  using relative distances between points.
         */
        static double[] ChordLengthParameterize(Point[] d, int first, int last)
        {
            int i;
            double[] u = new double[last - first + 1];           /*  Parameterization        */

            u[0] = 0.0;
            for (i = first + 1; i <= last; i++)
            {
                u[i - first] = u[i - first - 1] + (d[i - 1] - d[i]).Length;
            }

            for (i = first + 1; i <= last; i++)
            {
                u[i - first] = u[i - first] / u[last - first];
            }

            return u;
        }




        /*
         *  ComputeMaxError :
         *  Find the maximum squared distance of digitized points
         *  to fitted curve.
        */
        static double ComputeMaxError(Point[] d, int first, int last, Point[] bezCurve, double[] u, out int splitPoint)
        {
            int i;
            double maxDist;        /*  Maximum error       */
            double dist;       /*  Current error       */
            Point P;          /*  Point on curve      */
            Point v;          /*  Vector from point to curve  */

            splitPoint = (last - first + 1) / 2;
            maxDist = 0.0;
            for (i = first + 1; i < last; i++)
            {
                P = BezierII(3, bezCurve, u[i - first]);
                v = P - d[i];
                dist = v.LengthSquared;
                if (dist >= maxDist)
                {
                    maxDist = dist;
                    splitPoint = i;
                }
            }
            return maxDist;
        }

        private static double V2Dot(Point a, Point b)
        {
            return ((a.X * b.X) + (a.Y * b.Y));
        }

    }

}

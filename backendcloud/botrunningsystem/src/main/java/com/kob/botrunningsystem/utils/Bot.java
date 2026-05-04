package com.kob.botrunningsystem.utils;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class Bot implements com.kob.botrunningsystem.utils.BotInterface {
    private static final int ROWS = 13;
    private static final int COLS = 14;
    private static final int DEPTH = 3;
    private static final int INF = 1 << 28;
    private static final double WIN = 100000000.0;
    private static final double LOSE = -100000000.0;
    private static final double DRAW = -5000000.0;
    private static final int[] DX = {-1, 0, 1, 0};
    private static final int[] DY = {0, 1, 0, -1};

    static class Cell {
        public int x, y;

        public Cell(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    private boolean check_tail_increasing(int step) {
        if (step <= 10) return true;
        return step % 3 == 1;
    }

    public List<Cell> getCells(int sx, int sy, String steps) {
        steps = steps.substring(1, steps.length() - 1);
        List<Cell> res = new ArrayList<>();
        int x = sx, y = sy;
        int step = 0;
        res.add(new Cell(x, y));

        for (int i = 0; i < steps.length(); i++) {
            int d = steps.charAt(i) - '0';
            x += DX[d];
            y += DY[d];
            res.add(new Cell(x, y));
            if (!check_tail_increasing(++step)) {
                res.remove(0);
            }
        }
        return res;
    }

    private boolean inBoard(int x, int y) {
        return x >= 0 && x < ROWS && y >= 0 && y < COLS;
    }

    private boolean same(Cell a, Cell b) {
        return a.x == b.x && a.y == b.y;
    }

    private Cell head(List<Cell> cells) {
        return cells.get(cells.size() - 1);
    }

    private List<Cell> move(List<Cell> cells, int d, int nextStep) {
        List<Cell> next = new ArrayList<>(cells.size() + 1);
        for (Cell c : cells) next.add(new Cell(c.x, c.y));

        Cell h = head(cells);
        next.add(new Cell(h.x + DX[d], h.y + DY[d]));
        if (!check_tail_increasing(nextStep)) {
            next.remove(0);
        }
        return next;
    }

    private boolean valid(int[][] wall, List<Cell> me, List<Cell> enemy) {
        Cell h = head(me);
        if (!inBoard(h.x, h.y) || wall[h.x][h.y] == 1) return false;

        for (int i = 0; i + 1 < me.size(); i++) {
            if (same(h, me.get(i))) return false;
        }
        for (int i = 0; i + 1 < enemy.size(); i++) {
            if (same(h, enemy.get(i))) return false;
        }
        return true;
    }

    private int[][] bfs(Cell start, boolean[][] blocked) {
        int[][] dist = new int[ROWS][COLS];
        for (int i = 0; i < ROWS; i++) Arrays.fill(dist[i], INF);
        if (!inBoard(start.x, start.y) || blocked[start.x][start.y]) return dist;

        Queue<Cell> q = new ArrayDeque<>();
        dist[start.x][start.y] = 0;
        q.add(start);

        while (!q.isEmpty()) {
            Cell cur = q.remove();
            for (int d = 0; d < 4; d++) {
                int x = cur.x + DX[d], y = cur.y + DY[d];
                if (inBoard(x, y) && !blocked[x][y] && dist[x][y] == INF) {
                    dist[x][y] = dist[cur.x][cur.y] + 1;
                    q.add(new Cell(x, y));
                }
            }
        }
        return dist;
    }

    private boolean[][] getBlocked(int[][] wall, List<Cell> me, List<Cell> enemy) {
        boolean[][] blocked = new boolean[ROWS][COLS];
        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++) {
                blocked[i][j] = wall[i][j] == 1;
            }
        }
        for (int i = 0; i + 1 < me.size(); i++) {
            Cell c = me.get(i);
            if (inBoard(c.x, c.y)) blocked[c.x][c.y] = true;
        }
        for (int i = 0; i + 1 < enemy.size(); i++) {
            Cell c = enemy.get(i);
            if (inBoard(c.x, c.y)) blocked[c.x][c.y] = true;
        }
        return blocked;
    }

    private int countNextChoices(int[][] wall, List<Cell> me, List<Cell> enemy, int step) {
        int cnt = 0;
        for (int d = 0; d < 4; d++) {
            List<Cell> next = move(me, d, step + 1);
            if (valid(wall, next, enemy)) cnt++;
        }
        return cnt;
    }

    private double stateScore(int[][] wall, List<Cell> me, List<Cell> enemy, int myStep, int enemyStep) {
        boolean[][] blocked = getBlocked(wall, me, enemy);
        Cell mh = head(me), eh = head(enemy);
        blocked[mh.x][mh.y] = false;
        blocked[eh.x][eh.y] = false;

        int[][] md = bfs(mh, blocked);
        int[][] ed = bfs(eh, blocked);
        double mySpace = 0, enemySpace = 0;
        int reachable = 0, enemyReachable = 0;

        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++) {
                if (blocked[i][j]) continue;
                if (md[i][j] < INF) reachable++;
                if (ed[i][j] < INF) enemyReachable++;

                if (md[i][j] < INF && ed[i][j] < INF) {
                    if (md[i][j] < ed[i][j]) mySpace++;
                    else if (md[i][j] > ed[i][j]) enemySpace++;
                    else {
                        mySpace += 0.5;
                        enemySpace += 0.5;
                    }
                } else if (md[i][j] < INF) {
                    mySpace++;
                } else if (ed[i][j] < INF) {
                    enemySpace++;
                }
            }
        }

        int choices = countNextChoices(wall, me, enemy, myStep);
        int enemyChoices = countNextChoices(wall, enemy, me, enemyStep);
        int dist = Math.abs(mh.x - eh.x) + Math.abs(mh.y - eh.y);
        int wallDist = Math.min(Math.min(mh.x, ROWS - 1 - mh.x), Math.min(mh.y, COLS - 1 - mh.y));

        double score = 0;
        score += (mySpace - enemySpace) * 24.0;
        score += (reachable - enemyReachable) * 4.0;
        score += (me.size() - enemy.size()) * 16.0;
        score += choices * 80.0 - enemyChoices * 45.0;
        if (choices <= 1) score -= 220.0;
        if (enemyChoices <= 1) score += 160.0;
        score += wallDist * 6.0;

        if (mySpace >= enemySpace || me.size() >= enemy.size()) {
            score += (26 - dist) * 5.0;
        } else {
            score += dist * 6.0;
        }
        return score;
    }

    private double terminalScore(boolean meAlive, boolean enemyAlive, int depth) {
        if (!meAlive && !enemyAlive) return DRAW;
        if (!meAlive) return LOSE - depth * 1000.0;
        if (!enemyAlive) return WIN + depth * 1000.0;
        return 0.0;
    }

    private double scoreMyMove(int[][] wall, List<Cell> me, List<Cell> enemy,
                               int myStep, int enemyStep, int dir, int depth) {
        double worst = WIN;
        double sum = 0.0;
        double fallback = LOSE;
        int aliveReplies = 0;

        for (int od = 0; od < 4; od++) {
            List<Cell> nme = move(me, dir, myStep + 1);
            List<Cell> nenemy = move(enemy, od, enemyStep + 1);
            boolean meAlive = valid(wall, nme, nenemy);
            boolean enemyAlive = valid(wall, nenemy, nme);

            double cur;
            if (!meAlive || !enemyAlive) {
                cur = terminalScore(meAlive, enemyAlive, depth);
            } else if (depth <= 1) {
                cur = stateScore(wall, nme, nenemy, myStep + 1, enemyStep + 1);
            } else {
                cur = search(wall, nme, nenemy, myStep + 1, enemyStep + 1, depth - 1);
            }

            if (enemyAlive) {
                aliveReplies++;
                worst = Math.min(worst, cur);
                sum += cur;
            } else {
                fallback = Math.max(fallback, cur);
            }
        }

        if (aliveReplies == 0) return fallback;
        return worst * 0.85 + (sum / aliveReplies) * 0.15;
    }

    private double search(int[][] wall, List<Cell> me, List<Cell> enemy,
                          int myStep, int enemyStep, int depth) {
        double best = LOSE;
        for (int d = 0; d < 4; d++) {
            best = Math.max(best, scoreMyMove(wall, me, enemy, myStep, enemyStep, d, depth));
        }
        return best;
    }

    @Override
    public Integer nextMove(String input) {
        String[] strs = input.split("#");
        int[][] wall = new int[ROWS][COLS];
        for (int i = 0, k = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++, k++) {
                wall[i][j] = strs[0].charAt(k) == '1' ? 1 : 0;
            }
        }

        int mySx = Integer.parseInt(strs[1]), mySy = Integer.parseInt(strs[2]);
        int enemySx = Integer.parseInt(strs[4]), enemySy = Integer.parseInt(strs[5]);
        List<Cell> me = getCells(mySx, mySy, strs[3]);
        List<Cell> enemy = getCells(enemySx, enemySy, strs[6]);
        int myStep = strs[3].length() - 2;
        int enemyStep = strs[6].length() - 2;

        int bestDir = 0;
        double bestScore = LOSE * 2;
        for (int d = 0; d < 4; d++) {
            double score = scoreMyMove(wall, me, enemy, myStep, enemyStep, d, DEPTH);
            if (score > bestScore) {
                bestScore = score;
                bestDir = d;
            }
        }
        return bestDir;
    }
}

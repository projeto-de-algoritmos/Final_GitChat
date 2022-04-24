class Node {
  constructor(char, weight, left, right) {
    this.char = char;
    this.weight = weight;
    this.left = left;
    this.right = right;
  }
}

const sortfreq = (str) => {
  let dict = {};
  let freqs = [];
  for (var i in str) {
    if (str[i] in dict) dict[str[i]] += 1;
    else dict[str[i]] = 1;
  }
  for (var key in dict) {
    freqs.push([key, dict[key]]);
  }
  return freqs.sort((a, b) => b[1] - a[1]);
};

const makenodes = (freqs) => {
  let nodes = [];
  for (let i = 0; i < freqs.length; i++) {
    nodes.push(new Node(freqs[i][0], freqs[i][1]));
  }
  return nodes;
};

const makenode = (left, right) => {
  return new Node(left.char + right.char, left.weight + right.weight, left, right);
};

/* BUILD A CODE TREE */
const buildtree = (nodes) => {
  while (nodes.length > 1) {
    nodes.push(makenode(nodes.pop(), nodes.pop()));
    nodes.sort((a, b) => b.weight - a.weight);
  }

  return nodes;
};

const encodeeach = (s, tree) => {
  var encoded = [],
    curr_branch = tree[0];
  while (curr_branch.left && curr_branch.right) {
    if (curr_branch.left.char.indexOf(s) != -1) {
      encoded.push(0);
      curr_branch = curr_branch.left;
    } else if (curr_branch.right.char.indexOf(s) != -1) {
      encoded.push(1);
      curr_branch = curr_branch.right;
    }
  }
  return encoded;
};

const encode = (str, tree) => {
  let encoded = [];
  for (var c in str) encoded = encoded.concat(encodeeach(str[c], tree));
  return encoded;
};

const decodeeach = (tree, bits) => {
  if (tree.left && tree.right && bits.length != 0) {
    if (bits[0] == 1) {
      bits.shift();
      return decodeeach(tree.right, bits);
    } else {
      bits.shift();
      return decodeeach(tree.left, bits);
    }
  } else if (!tree.left && !tree.right) return tree.char;
};

const decode = (bits, tree) => {
  var decoded = [];
  while (bits.length != 0) decoded.push(decodeeach(tree[0], bits));
  return decoded.join('');
};

let tree;

export const compress = (text) => {
  if (!text) {
    return;
  }

  let sorted = sortfreq(text);
  tree = buildtree(makenodes(sorted));
  let compressed = encode(text, tree);
  compressed = compressed.join('');

  return { compressed, tree };
};

export const decompress = (text, tree) => {
  let decoded = decode(text.split(''), tree);

  return decoded;
};

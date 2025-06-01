import React, { ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 12, fontWeight: 'bold', color: 'red' }}>
            Bir hata oluştu
          </Text>
          <Text style={{ marginBottom: 12, textAlign: 'center' }}>
            Uygulama çalışırken beklenmeyen bir hata oluştu.
          </Text>
          <Button title="Yeniden Dene" onPress={this.handleReset} />
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
